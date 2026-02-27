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

import type { NFTType } from './nft.ts';

export const COOLDOWN_BASES: Record<NFTType, number> = {
  'turbo-flush':  3,
  'cruise-seat':  10,
  'zen-fortress': 22,
};

export const LINEAR_MULT = 0.3;
export const EXP_MULT    = 0.02;

/** Cooldown duration in hours for the given type and level. */
export function calcCooldownHours(type: NFTType, level: number): number {
  const base = COOLDOWN_BASES[type] ?? COOLDOWN_BASES['cruise-seat'];
  return base + level * LINEAR_MULT + Math.pow(level, 2) * EXP_MULT;
}

/**
 * Timestamp at which the cooldown expires, given the last-use time.
 * Returns null when lastUsedAt is null (never used → always ready).
 */
export function getCooldownEndsAt(
  lastUsedAt: string | null,
  type: NFTType,
  level: number,
): Date | null {
  if (!lastUsedAt) return null;
  const hours = calcCooldownHours(type, level);
  return new Date(new Date(lastUsedAt).getTime() + hours * 3_600_000);
}

/** Whether the NFT is currently within its cooldown window. */
export function isOnCooldown(
  lastUsedAt: string | null,
  type: NFTType,
  level: number,
): boolean {
  const endsAt = getCooldownEndsAt(lastUsedAt, type, level);
  if (!endsAt) return false;
  return endsAt > new Date();
}

/** Remaining cooldown in whole seconds (0 when not on cooldown). */
export function cooldownRemainingSeconds(
  lastUsedAt: string | null,
  type: NFTType,
  level: number,
): number {
  const endsAt = getCooldownEndsAt(lastUsedAt, type, level);
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000));
}
