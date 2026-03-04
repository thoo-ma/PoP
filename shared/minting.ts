/**
 * NFT minting constants — single source of truth for frontend, dashboard,
 * and Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/minting.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTRarity } from './nft.ts';

/**
 * Per-rarity stat ranges for freshly minted (non-bred) NFTs.
 * Higher rarity boxes produce higher base stats.
 *
 * Each value is a tuple: [min, max] (inclusive).
 */
export const STAT_RANGES: Record<NFTRarity, [number, number]> = {
  common:       [40, 70],
  rare:         [50, 80],
  legendary:    [60, 90],
  transcendent: [70, 100],
};
