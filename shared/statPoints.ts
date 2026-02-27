/**
 * Stat-point and energy constants — single source of truth for frontend and
 * Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/statPoints.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTRarity } from './nft.ts';

/** Number of stat points awarded per level-up, keyed by rarity. */
export const STAT_POINTS_BY_RARITY: Record<NFTRarity, number> = {
  common:       4,
  rare:         10,
  legendary:    14,
  transcendent: 18,
};

/** Maximum NFT energy value. */
export const MAX_ENERGY = 100;
