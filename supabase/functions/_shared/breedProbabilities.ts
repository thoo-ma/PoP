// Breed probability constants shared across Supabase Edge Functions.
// Keep in sync with: frontend/constants/breedProbabilities.ts

export type NFTRarity = 'common' | 'rare' | 'legendary' | 'transcendent';

export const RARITIES: NFTRarity[] = ['common', 'rare', 'legendary', 'transcendent'];

export const RARITY_RANK: Record<NFTRarity, number> = {
  common: 0,
  rare: 1,
  legendary: 2,
  transcendent: 3,
};

/**
 * All rarity-pair keys for which breeding is allowed (rank diff ≤ 1, always
 * sorted lower+higher). Adding a new NFTRarity without updating this type
 * and the table below will be a compile-time error.
 */
export type BreedPairKey =
  | 'common+common'
  | 'common+rare'
  | 'rare+rare'
  | 'rare+legendary'
  | 'legendary+legendary'
  | 'legendary+transcendent'
  | 'transcendent+transcendent';

/**
 * Maps a sorted rarity-pair key ("lower+higher") to
 * [common%, rare%, legendary%, transcendent%] outcome probabilities.
 */
export const BREED_PROBABILITIES: Record<BreedPairKey, [number, number, number, number]> = {
  'common+common':             [97.9,  2.0,  0.1,  0.0],
  'common+rare':               [65.0, 34.0,  0.9,  0.1],
  'rare+rare':                 [ 5.0, 92.0,  2.5,  0.5],
  'rare+legendary':            [ 2.0, 20.0, 75.0,  3.0],
  'legendary+legendary':       [ 1.0,  9.0, 80.0, 10.0],
  'legendary+transcendent':    [ 0.5,  4.5, 25.0, 70.0],
  'transcendent+transcendent': [ 0.1,  1.9,  8.0, 90.0],
};
