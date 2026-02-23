export * from './theme';
export * from './sensors';
export * from './breedProbabilities';

// Sort options for NFTs
export const SORT_OPTIONS = ['efficiency', 'resilience', 'comfort', 'luck', 'level'] as const;

// NFT Type Names
// Maps each type to its available named slugs (matches Supabase storage structure)
export const TYPE_NAMES = {
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

