import type { SortOption } from '../types';
import type { MockNFT } from '../constants/mockData';

/**
 * Sort NFTs by a specific property in ascending or descending order
 */
export function sortNFTs(
  nfts: MockNFT[], 
  sortBy: SortOption, 
  sortOrder: 'asc' | 'desc'
): MockNFT[] {
  return [...nfts].sort((a, b) => {
    return sortOrder === 'desc' ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
  });
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
