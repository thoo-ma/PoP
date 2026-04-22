import type {
  BustedDetails,
  CooldownDetails,
  EdgeFunctionErrorResponse,
  InsufficientPoopDetails,
  MysteryBox,
} from '@pop/shared'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AllocateResult, NFT, StatDeltas } from '@/types'

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

// ── Result types co-located with their wrappers ──────────────────────────────

export interface RepairResult {
  id: string
  /** Energy value after the repair */
  energy: number
  /** POOP spent for this repair */
  poop_spent: number
  /** Updated wallet balance */
  poop_balance: number
}

export interface PoopResult {
  id: string
  /** Energy value after the use */
  energy: number
  energy_lost: number
  depleted: boolean
  /** XP within the current level after the use */
  xp: number
  /** XP earned this poop */
  xp_gained: number
  /** Level after the use */
  level: number
  /** Whether the NFT leveled up this poop */
  leveled_up: boolean
  /** Total unspent stat points on the NFT after this poop */
  stat_points: number
  /** POOP currency earned this use */
  poop_earned: number
  /** Updated wallet balance after this use */
  poop_balance: number
  /** ID of the newly created pending loot roll — pass to rollLoot */
  loot_roll_id: string | null
}

export interface HoldLootResult {
  /** Updated holds count after this hold (1–3) */
  holds: number
}

export interface RollLootResult {
  won: boolean
  holds_used: number
  box?: { id: string; rarity: string }
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
 * Invoke a Supabase Edge Function with consistent error parsing.
 *
 * - Parses `FunctionsHttpError` body into `EdgeFunctionErrorResponse`.
 * - Optional `errorMapper` translates structured errors into typed domain
 *   exceptions (e.g. `BustedError`, `CooldownError`).
 * - Falls back to `Error(body.message ?? body.error ?? error.message)`.
 * - Throws `Error("No data returned from <name> function")` on missing data.
 */
async function invokeEdgeFunction<TResult>(
  name: string,
  body: Record<string, unknown>,
  errorMapper?: ErrorMapper,
): Promise<TResult> {
  const { data, error: fnError } = await supabase.functions.invoke(name, { body })

  if (fnError) {
    let message: string = fnError.message
    let parsedBody: EdgeFunctionErrorResponse | null = null
    let httpStatus: number | null = null

    if (fnError instanceof FunctionsHttpError) {
      httpStatus = fnError.context.status
      try {
        parsedBody = (await fnError.context.json()) as EdgeFunctionErrorResponse
        if (parsedBody?.message) message = parsedBody.message
        else if (parsedBody?.error) message = parsedBody.error
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

  return data as TResult
}

// ── Typed wrappers ───────────────────────────────────────────────────────────

export function allocateStatPoints(nftId: string, deltas: StatDeltas): Promise<AllocateResult> {
  return invokeEdgeFunction<AllocateResult>('allocate-stat-points', {
    nft_id: nftId,
    efficiency: deltas.efficiency,
    resilience: deltas.resilience,
    comfort: deltas.comfort,
    luck: deltas.luck,
  })
}

export function breedNFTs(
  parent1Id: string,
  parent2Id: string,
  degenPercent: number,
): Promise<MysteryBox> {
  return invokeEdgeFunction<MysteryBox>(
    'breed-nfts',
    { parent1_id: parent1Id, parent2_id: parent2Id, degen_percent: degenPercent },
    (body) => {
      if (body?.error === 'busted') {
        const d = body.details as unknown as BustedDetails | undefined
        return new BustedError({
          poop_spent: d?.poop_spent ?? 0,
          poop_balance: d?.poop_balance ?? 0,
        })
      }
      return null
    },
  )
}

export function repairNFT(
  nftId: string,
  newEnergy: number,
  degenPercent: number,
): Promise<RepairResult> {
  return invokeEdgeFunction<RepairResult>(
    'repair-nft',
    { nft_id: nftId, new_energy: newEnergy, degen_percent: degenPercent },
    (body) => {
      if (body?.error === 'insufficient_poop' && body.details) {
        const d = body.details as unknown as InsufficientPoopDetails
        return new InsufficientPoopError({
          poop_balance: d.poop_balance,
          poop_required: d.poop_required,
        })
      }
      if (body?.error === 'busted') {
        const d = body.details as unknown as BustedDetails | undefined
        return new BustedError({
          poop_spent: d?.poop_spent ?? 0,
          poop_balance: d?.poop_balance ?? 0,
        })
      }
      return null
    },
  )
}

export function poopNFT(nftId: string): Promise<PoopResult> {
  return invokeEdgeFunction<PoopResult>('use-nft', { nft_id: nftId }, (body) => {
    if (body?.error === 'on_cooldown' && body.details) {
      const d = body.details as unknown as CooldownDetails
      return new CooldownError({
        cooldown_ends_at: d.cooldown_ends_at,
        cooldown_remaining_seconds: d.cooldown_remaining_seconds,
      })
    }
    return null
  })
}

export function openMysteryBox(boxId: string): Promise<NFT> {
  return invokeEdgeFunction<NFT>('open-mystery-box', { box_id: boxId })
}

export function holdLootRoll(lootRollId: string): Promise<HoldLootResult> {
  return invokeEdgeFunction<HoldLootResult>('hold-loot-roll', { loot_roll_id: lootRollId })
}

export function rollLoot(lootRollId: string): Promise<RollLootResult> {
  return invokeEdgeFunction<RollLootResult>('roll-loot', { loot_roll_id: lootRollId })
}
