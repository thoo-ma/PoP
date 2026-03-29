import type { SortOption, NFT } from "@/types";

/**
 * Sort NFTs by a specific property in ascending or descending order
 */
export function sortNFTs(nfts: NFT[], sortBy: SortOption, sortOrder: "asc" | "desc"): NFT[] {
  return [...nfts].sort((a, b) => {
    return sortOrder === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
  });
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
