import type { NFTTier } from '../../types/nft';
import { TIER_VARIANTS } from '../../constants';

/**
 * Returns a random variant name for the given NFT tier.
 */
export const getRandomVariant = (tier: NFTTier): string => {
  const variants = TIER_VARIANTS[tier];
  return variants[Math.floor(Math.random() * variants.length)];
};

/**
 * Converts a kebab-case variant slug into a title-cased display string.
 * e.g. "ancient-egyptian" → "Ancient Egyptian"
 */
export const formatVariantName = (variant: string): string => {
  return variant
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
