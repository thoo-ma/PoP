/**
 * RPC contracts shared between the database (Supabase functions / RPCs) and clients.
 */

import { z } from 'zod'
import { EdgeFunctionErrorCode } from './errors'
import type { NFTRarity, NFTType } from './nft'

/**
 * Result returned by the `validate_and_approve_user` Postgres RPC.
 */
export interface ApprovalResult {
  success: boolean
  error: string | null
}

// ─── Reusable sub-schemas ───────────────────────────────────────────────────

// Inline literal tuples (rather than `z.enum(RARITIES as [string, ...string[]])`)
// so the inferred Zod type narrows to the exact `NFTRarity` / `NFTType` unions
// instead of `string`. Kept in sync manually with `./nft.ts`.
const NFTRarityEnum = z.enum(['common', 'rare', 'legendary', 'transcendent']) satisfies z.ZodType<
  NFTRarity,
  z.ZodTypeDef,
  NFTRarity
>
const NFTTypeEnum = z.enum(['cruise-seat', 'turbo-flush', 'zen-fortress']) satisfies z.ZodType<
  NFTType,
  z.ZodTypeDef,
  NFTType
>
const ErrorCodeEnum = z.enum(
  Object.values(EdgeFunctionErrorCode) as [EdgeFunctionErrorCode, ...EdgeFunctionErrorCode[]],
)

/**
 * Structured warning attached to partial-success edge function responses.
 * Mirrors the `Warning` type defined in `supabase/functions/_shared/responses.ts`.
 */
export const WarningSchema = z.object({
  code: z.string(),
  detail: z.string().optional(),
})
export type Warning = z.infer<typeof WarningSchema>

const optionalWarnings = z.array(WarningSchema).optional()

// ═══════════════════════════════════════════════════════════════════════════════
// Edge function response schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** `allocate-stat-points` Edge Function response. */
export const AllocateStatPointsResponseSchema = z.object({
  id: z.string(),
  efficiency: z.number(),
  resilience: z.number(),
  comfort: z.number(),
  luck: z.number(),
  stat_points: z.number(),
})
export type AllocateStatPointsResponse = z.infer<typeof AllocateStatPointsResponseSchema>

/** `breed-nfts` Edge Function response. Strips server-side cost/audit fields. */
export const BreedNftsResponseSchema = z.object({
  id: z.string(),
  rarity: NFTRarityEnum,
  image_url: z.string(),
  blurhash: z.string().nullable(),
  opened: z.boolean(),
  created_at: z.string(),
  warnings: optionalWarnings,
})
export type BreedNftsResponse = z.infer<typeof BreedNftsResponseSchema>

/** `repair-nft` Edge Function response. Strips server-side audit fields. */
export const RepairNftResponseSchema = z.object({
  id: z.string(),
  energy: z.number(),
  poop_spent: z.number(),
  poop_balance: z.number(),
})
export type RepairNftResponse = z.infer<typeof RepairNftResponseSchema>

/** `use-nft` (poop) Edge Function response. */
export const UseNftResponseSchema = z.object({
  id: z.string(),
  energy: z.number(),
  energy_lost: z.number(),
  depleted: z.boolean(),
  xp: z.number(),
  xp_gained: z.number(),
  level: z.number(),
  leveled_up: z.boolean(),
  stat_points: z.number(),
  poop_earned: z.number(),
  poop_balance: z.number(),
  loot_roll_id: z.string().nullable(),
  warnings: optionalWarnings,
})
export type UseNftResponse = z.infer<typeof UseNftResponseSchema>

/**
 * `open-mystery-box` Edge Function response.
 *
 * Intentionally narrower than the full `NFT` row: the handler omits
 * `breed_count`, `last_used_at`, and `stat_points`. The frontend invalidates
 * the `userNFTs` query immediately afterwards, which refetches the full row.
 */
export const OpenMysteryBoxResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  image_url: z.string(),
  blurhash: z.string().nullable(),
  type: NFTTypeEnum,
  rarity: NFTRarityEnum,
  efficiency: z.number(),
  resilience: z.number(),
  comfort: z.number(),
  luck: z.number(),
  energy: z.number(),
  level: z.number(),
  xp: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  warnings: optionalWarnings,
})
export type OpenMysteryBoxResponse = z.infer<typeof OpenMysteryBoxResponseSchema>

/** `hold-loot-roll` Edge Function response. */
export const HoldLootRollResponseSchema = z.object({
  holds: z.number(),
})
export type HoldLootRollResponse = z.infer<typeof HoldLootRollResponseSchema>

/** `roll-loot` Edge Function response. */
export const RollLootResponseSchema = z.object({
  won: z.boolean(),
  holds_used: z.number(),
  box: z
    .object({
      id: z.string(),
      rarity: NFTRarityEnum,
    })
    .optional(),
  warnings: optionalWarnings,
})
export type RollLootResponse = z.infer<typeof RollLootResponseSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// Error envelope schema
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Canonical error envelope returned by every edge function.
 * Mirrors `EdgeFunctionErrorResponse` in `errors.ts` but enables runtime
 * validation when parsing failure bodies on the client.
 */
export const EdgeFunctionErrorResponseSchema = z.object({
  error: ErrorCodeEnum,
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
})
