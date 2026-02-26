import type { NFTRarity } from '@/types/nft';

/**
 * Number of stat points awarded per level-up, keyed by rarity.
 * Must be kept in sync with STAT_POINTS_BY_RARITY in the use-nft Edge Function.
 */
export const STAT_POINTS_BY_RARITY: Record<NFTRarity, number> = {
  common:       4,
  rare:         10,
  legendary:    14,
  transcendent: 18,
};
