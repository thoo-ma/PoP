/**
 * Core NFT type definitions — single source of truth for frontend and
 * Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/nft.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

export type NFTType = 'cruise-seat' | 'turbo-flush' | 'zen-fortress';

export type NFTRarity = 'common' | 'rare' | 'legendary' | 'transcendent';

export const RARITIES: NFTRarity[] = ['common', 'rare', 'legendary', 'transcendent'];

export const NFT_TYPES: NFTType[] = ['cruise-seat', 'turbo-flush', 'zen-fortress'];

export const RARITY_RANK: Record<NFTRarity, number> = {
  common:       0,
  rare:         1,
  legendary:    2,
  transcendent: 3,
};

/** A mystery box owned by a user. No stats — utility is deferred. */
export type MysteryBox = {
  id: string;
  rarity: NFTRarity;
  image_url: string;
  opened: boolean;
  created_at: string;
};

/** Maps each NFT type to its available named slugs (matches Supabase storage structure). */
export const TYPE_NAMES: Record<NFTType, readonly string[]> = {
  'cruise-seat': [
    'ancient-egyptian',
    'ancient-maya-stone',
    'medieval-castle-garderobe',
    'prehistoric-stone',
    'victorian-era-wooden-throne',
  ],
  'turbo-flush': [
    'astronaut-zero-gravity',
    'portable-construction-site-cabin',
    'prehistoric-sanitation',
    'roman-public-latrines',
    'rustic-forest-outhouse',
    'squat',
  ],
  'zen-fortress': [
    'cyberpunk-dystopian',
    'dubai',
    'eco-friendly',
    'futuristic-sci-fi-vacuum',
    'renaissance-chaise',
  ],
} as const;
