/**
 * Cooldown constants and helpers — mirrors supabase/functions/_shared/cooldown.ts.
 *
 * Formula:
 *   cooldown_hours = base + (level × LINEAR_MULT) + (level² × EXP_MULT)
 *
 * The server (use-nft edge function) is authoritative; these helpers are used
 * client-side only for optimistic display purposes.
 */

import type { NFT, NFTType } from '@/types/nft';

export const COOLDOWN_BASES = {
  'turbo-flush':  3,
  'cruise-seat':  10,
  'zen-fortress': 22,
} as const satisfies Record<NFTType, number>;

export const COOLDOWN_LINEAR_MULT = 0.3;
export const COOLDOWN_EXP_MULT    = 0.02;

/** Cooldown duration in hours for the given NFT type and level. */
export function calcCooldownHours(type: NFTType, level: number): number {
  const base = COOLDOWN_BASES[type];
  return base + level * COOLDOWN_LINEAR_MULT + Math.pow(level, 2) * COOLDOWN_EXP_MULT;
}

/** Human-readable countdown string, e.g. "2h 34m" or "45m" or "30s". */
function formatCooldown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0s';
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export interface CooldownStatus {
  isOnCooldown: boolean;
  /** When the cooldown expires, or null if the NFT has never been used. */
  endsAt: Date | null;
  /** Remaining seconds (0 when not on cooldown). */
  remainingSeconds: number;
  /** Human-readable string, e.g. "2h 34m". Empty string when not on cooldown. */
  display: string;
}

/**
 * Compute the current cooldown status for an NFT.
 *
 * Uses `nft.last_used_at` (set by the server on each use). If null (never used)
 * the NFT is always ready.
 */
export function getCooldownStatus(nft: Pick<NFT, 'type' | 'level' | 'last_used_at'>): CooldownStatus {
  if (!nft.last_used_at) {
    return { isOnCooldown: false, endsAt: null, remainingSeconds: 0, display: '' };
  }

  const hours     = calcCooldownHours(nft.type, nft.level);
  const endsAt    = new Date(new Date(nft.last_used_at).getTime() + hours * 3_600_000);
  const remaining = Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000));

  return {
    isOnCooldown:     remaining > 0,
    endsAt,
    remainingSeconds: remaining,
    display:          remaining > 0 ? formatCooldown(remaining) : '',
  };
}
