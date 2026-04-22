import type {
  AllocateStatPointsResponse,
  BreedNftsResponse,
  BustedDetails,
  CooldownDetails,
  EdgeFunctionErrorResponse,
  HoldLootRollResponse,
  InsufficientPoopDetails,
  OpenMysteryBoxResponse,
  RepairNftResponse,
  RollLootResponse,
  UseNftResponse,
} from '@pop/shared'
import {
  AllocateStatPointsResponseSchema,
  BreedNftsResponseSchema,
  EdgeFunctionErrorResponseSchema,
  HoldLootRollResponseSchema,
  OpenMysteryBoxResponseSchema,
  RepairNftResponseSchema,
  RollLootResponseSchema,
  UseNftResponseSchema,
} from '@pop/shared'
import { FunctionsHttpError } from '@supabase/supabase-js'
import type { z } from 'zod'
import type { StatDeltas } from '@/types'
import { supabase } from './supabase'

// ── Domain error classes ─────────────────────────────────────────────────────

/** Thrown when the degen roll busts a breed or repair attempt. */
export class BustedError extends Error {
  constructor(public details: BustedDetails) {
    super('busted')
  }
}

/** Thrown when the user lacks enough POOP to perform the action. */
export class InsufficientPoopError extends Error {
  constructor(public details: InsufficientPoopDetails) {
    super('insufficient_poop')
  }
}

/** Thrown when an NFT is still on cooldown. */
export class CooldownError extends Error {
  constructor(public details: CooldownDetails) {
    super('on_cooldown')
  }
}

/**
 * Thrown when an edge function response fails Zod validation. Wraps the
 * underlying `ZodError` and carries the function name for telemetry. Hooks
 * filter this from generic errors and surface a stable user-facing message
 * instead of a raw Zod dump.
 */
export class ResponseValidationError extends Error {
  constructor(
    public functionName: string,
    public zodError: z.ZodError,
  ) {
    super(`Invalid response from ${functionName}`)
    this.name = 'ResponseValidationError'
  }
}

// ── Result types — re-exports of inferred schema types ──────────────────────
//
// Response shapes are defined as Zod schemas in `@pop/shared` (see
// `shared/src/rpc.ts`). The inferred types are re-exported here so callers
// (hooks, screens) can keep importing `RepairResult` / `PoopResult` / etc.
// from `@/lib/edgeFunctions` while validation happens transparently inside
// `invokeEdgeFunction`.

export type RepairResult = RepairNftResponse
export type PoopResult = UseNftResponse
export type HoldLootResult = HoldLootRollResponse
export type RollLootResult = RollLootResponse

// ── Domain error registry ────────────────────────────────────────────────────

/**
 * Single source of truth mapping server `error` codes to their typed domain
 * exceptions. Add a new entry here when introducing a new structured error.
 */
const errorRegistry = {
  busted: (d: Partial<BustedDetails> | undefined) =>
    new BustedError({
      poop_spent: d?.poop_spent ?? 0,
      poop_balance: d?.poop_balance ?? 0,
    }),
  insufficient_poop: (d: InsufficientPoopDetails) =>
    new InsufficientPoopError({
      poop_balance: d.poop_balance,
      poop_required: d.poop_required,
    }),
  on_cooldown: (d: CooldownDetails) =>
    new CooldownError({
      cooldown_ends_at: d.cooldown_ends_at,
      cooldown_remaining_seconds: d.cooldown_remaining_seconds,
    }),
} as const

type ErrorCode = keyof typeof errorRegistry

/**
 * Build an `ErrorMapper` that translates the listed structured error codes
 * into their typed domain exceptions. Unlisted codes fall through to the
 * generic `Error(message)` path.
 */
function mapKnownErrors(codes: readonly ErrorCode[]): ErrorMapper {
  const allowed = new Set<string>(codes)
  return (body) => {
    if (!body?.error || !allowed.has(body.error)) return null
    const builder = errorRegistry[body.error as ErrorCode]
    return builder(body.details as never)
  }
}

// ── Generic invoker ──────────────────────────────────────────────────────────

/**
 * Map a parsed edge-function error body to a typed domain error. Return the
 * thrown error to surface it (the invoker re-throws it), or `null` to fall
 * through to the generic `Error(message)` flow.
 */
type ErrorMapper = (
  body: EdgeFunctionErrorResponse | null,
  httpStatus: number | null,
) => Error | null

/**
 * Invoke a Supabase Edge Function with consistent error parsing and runtime
 * response validation.
 *
 * - Parses `FunctionsHttpError` body, validating it with
 *   `EdgeFunctionErrorResponseSchema`. On parse failure the original message
 *   string is preserved (the underlying HTTP error is never swallowed).
 * - Optional `errorMapper` translates structured errors into typed domain
 *   exceptions (e.g. `BustedError`, `CooldownError`).
 * - Falls back to `Error(body.message ?? body.error ?? error.message)`.
 * - Throws `Error("No data returned from <name> function")` on missing data.
 * - When `responseSchema` is provided, the success body is validated with
 *   `.safeParse(...)`. A failure throws `ResponseValidationError` (wrapping
 *   the underlying `ZodError`) so silent type-casts can no longer pass.
 */
async function invokeEdgeFunction<TSchema extends z.ZodTypeAny>(
  name: string,
  body: Record<string, unknown>,
  responseSchema: TSchema,
  errorMapper?: ErrorMapper,
): Promise<z.infer<TSchema>> {
  const { data, error: fnError } = await supabase.functions.invoke(name, { body })

  if (fnError) {
    let message: string = fnError.message
    let parsedBody: EdgeFunctionErrorResponse | null = null
    let httpStatus: number | null = null

    if (fnError instanceof FunctionsHttpError) {
      httpStatus = fnError.context.status
      try {
        const raw = await fnError.context.json()
        const parsed = EdgeFunctionErrorResponseSchema.safeParse(raw)
        if (parsed.success) {
          parsedBody = parsed.data
          if (parsed.data.message) message = parsed.data.message
          else if (parsed.data.error) message = parsed.data.error
        } else {
          // Body shape diverged from the canonical envelope — log and fall
          // through to the original transport-level message rather than
          // swallow the HTTP error.
          console.warn(
            `invokeEdgeFunction: ${name} returned a malformed error envelope`,
            parsed.error.issues,
          )
        }
      } catch {
        /* leave message as-is */
      }
    }

    if (errorMapper) {
      const mapped = errorMapper(parsedBody, httpStatus)
      if (mapped) throw mapped
    }

    throw new Error(message)
  }

  if (!data) throw new Error(`No data returned from ${name} function`)

  const result = responseSchema.safeParse(data)
  if (!result.success) {
    throw new ResponseValidationError(name, result.error)
  }
  return result.data
}

// ── Edge function names ─────────────────────────────────────────────────────

/**
 * Single source of truth for every Supabase Edge Function name invoked from
 * the frontend. Use these constants instead of inline string literals so that
 * typos are caught at compile time and call sites are trivially greppable.
 */
const EDGE_FUNCTIONS = {
  allocateStatPoints: 'allocate-stat-points',
  breedNFTs: 'breed-nfts',
  repairNFT: 'repair-nft',
  poopNFT: 'use-nft',
  openMysteryBox: 'open-mystery-box',
  holdLootRoll: 'hold-loot-roll',
  rollLoot: 'roll-loot',
} as const

// ── Typed wrappers ──────────────────────────────────────────────────────────

export function allocateStatPoints(
  nftId: string,
  deltas: StatDeltas,
): Promise<AllocateStatPointsResponse> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.allocateStatPoints,
    {
      nft_id: nftId,
      efficiency: deltas.efficiency,
      resilience: deltas.resilience,
      comfort: deltas.comfort,
      luck: deltas.luck,
    },
    AllocateStatPointsResponseSchema,
  )
}

export function breedNFTs(
  parent1Id: string,
  parent2Id: string,
  degenPercent: number,
): Promise<BreedNftsResponse> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.breedNFTs,
    { parent1_id: parent1Id, parent2_id: parent2Id, degen_percent: degenPercent },
    BreedNftsResponseSchema,
    mapKnownErrors(['busted']),
  )
}

export function repairNFT(
  nftId: string,
  newEnergy: number,
  degenPercent: number,
): Promise<RepairResult> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.repairNFT,
    { nft_id: nftId, new_energy: newEnergy, degen_percent: degenPercent },
    RepairNftResponseSchema,
    mapKnownErrors(['insufficient_poop', 'busted']),
  )
}

export function poopNFT(nftId: string): Promise<PoopResult> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.poopNFT,
    { nft_id: nftId },
    UseNftResponseSchema,
    mapKnownErrors(['on_cooldown']),
  )
}

export function openMysteryBox(boxId: string): Promise<OpenMysteryBoxResponse> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.openMysteryBox,
    { box_id: boxId },
    OpenMysteryBoxResponseSchema,
  )
}

export function holdLootRoll(lootRollId: string): Promise<HoldLootResult> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.holdLootRoll,
    { loot_roll_id: lootRollId },
    HoldLootRollResponseSchema,
  )
}

export function rollLoot(lootRollId: string): Promise<RollLootResult> {
  return invokeEdgeFunction(
    EDGE_FUNCTIONS.rollLoot,
    { loot_roll_id: lootRollId },
    RollLootResponseSchema,
  )
}
