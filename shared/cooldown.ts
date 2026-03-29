/**
 * Cooldown utilities — single source of truth for frontend and Supabase Edge
 * Functions.
 *
 * Formula:
 *   cooldown_hours = base + (level × LINEAR_MULT) + (level² × EXP_MULT)
 *
 * Type bases (hours):
 *   turbo-flush  →  3
 *   cruise-seat  → 10
 *   zen-fortress → 22
 *
 * Supabase imports via:   ../../../shared/cooldown.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTType } from './nft.ts'

// @migration: DELETE — game_config.cooldown
export const COOLDOWN_BASES: Record<NFTType, number> = {
  'turbo-flush': 3,
  'cruise-seat': 10,
  'zen-fortress': 22,
}

// @migration: DELETE — game_config.cooldown
export const LINEAR_MULT = 0.3
// @migration: DELETE — game_config.cooldown
export const EXP_MULT = 0.02

// Inline config type — avoids a circular dep with shared/schemas.ts
type CooldownCfg = {
  COOLDOWN_BASES?: Record<NFTType, number>
  LINEAR_MULT?: number
  EXP_MULT?: number
}

/** Cooldown duration in hours for the given type and level. */
export function calcCooldownHours(type: NFTType, level: number, cfg?: CooldownCfg): number {
  const bases = cfg?.COOLDOWN_BASES ?? COOLDOWN_BASES
  const linear = cfg?.LINEAR_MULT ?? LINEAR_MULT
  const exp = cfg?.EXP_MULT ?? EXP_MULT
  const base = bases[type] ?? bases['cruise-seat']
  return base + level * linear + Math.pow(level, 2) * exp
}

/**
 * Timestamp at which the cooldown expires, given the last-use time.
 * Returns null when lastUsedAt is null (never used → always ready).
 */
export function getCooldownEndsAt(
  lastUsedAt: string | null,
  type: NFTType,
  level: number,
  cfg?: CooldownCfg,
): Date | null {
  if (!lastUsedAt) return null
  const hours = calcCooldownHours(type, level, cfg)
  return new Date(new Date(lastUsedAt).getTime() + hours * 3_600_000)
}

/** Whether the NFT is currently within its cooldown window. */
export function isOnCooldown(
  lastUsedAt: string | null,
  type: NFTType,
  level: number,
  cfg?: CooldownCfg,
): boolean {
  const endsAt = getCooldownEndsAt(lastUsedAt, type, level, cfg)
  if (!endsAt) return false
  return endsAt > new Date()
}

/** Remaining cooldown in whole seconds (0 when not on cooldown). */
export function cooldownRemainingSeconds(
  lastUsedAt: string | null,
  type: NFTType,
  level: number,
  cfg?: CooldownCfg,
): number {
  const endsAt = getCooldownEndsAt(lastUsedAt, type, level, cfg)
  if (!endsAt) return 0
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000))
}
