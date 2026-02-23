import type { NFTType } from '@/types/nft';
import { TYPE_NAMES } from '@/constants';

/**
 * Returns a random name slug for the given NFT type.
 */
export const getRandomName = (type: NFTType): string => {
  const names = TYPE_NAMES[type];
  return names[Math.floor(Math.random() * names.length)];
};

/**
 * Converts a kebab-case name slug into a title-cased display string.
 * e.g. "ancient-egyptian" → "Ancient Egyptian"
 */
export const formatDisplayName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
