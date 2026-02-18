export * from './theme';
export * from './sensors';
export * from './breedProbabilities';
import type { NFTTier } from '../types/nft';

// Sort options for NFTs
export const SORT_OPTIONS = ['efficiency', 'resilience', 'comfort', 'luck', 'level'] as const;

// NFT Tier Variants
// Maps each tier to its available named variants (matches Supabase storage structure)
export const TIER_VARIANTS = {
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

// Helper function to get a random variant for a given tier
export const getRandomVariant = (tier: NFTTier): string => {
  const variants = TIER_VARIANTS[tier];
  return variants[Math.floor(Math.random() * variants.length)];
};

// Helper function to format variant name for display
export const formatVariantName = (variant: string): string => {
  return variant
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
