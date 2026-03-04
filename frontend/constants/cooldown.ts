/**
 * Cooldown helpers (frontend).
 *
 * Pure constants and math come from @shared/cooldown. This file adds
 * getCooldownStatus(), a UI helper that builds a friendly display string.
 */

import type { NFT } from '@/types';
import { calcCooldownHours } from '@shared';
import type { CooldownConfig } from '@shared/schemas';

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
export function getCooldownStatus(
  nft: Pick<NFT, 'type' | 'level' | 'last_used_at'>,
  cfg?: CooldownConfig,
): CooldownStatus {
  if (!nft.last_used_at) {
    return { isOnCooldown: false, endsAt: null, remainingSeconds: 0, display: '' };
  }

  const hours     = calcCooldownHours(nft.type, nft.level, cfg);
  const endsAt    = new Date(new Date(nft.last_used_at).getTime() + hours * 3_600_000);
  const remaining = Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000));

  return {
    isOnCooldown:     remaining > 0,
    endsAt,
    remainingSeconds: remaining,
    display:          remaining > 0 ? formatCooldown(remaining) : '',
  };
}
