import type { NFTRarity } from "@pop/shared";
import { RARITY_RANK, BREED_PROBABILITIES } from "@pop/shared";
import type { BreedPairKey } from "@pop/shared";

/**
 * Returns the [common%, rare%, legendary%, transcendent%] outcome probabilities
 * for a given pair of parent rarities.
 */
export function getProbabilities(r1: NFTRarity, r2: NFTRarity): [number, number, number, number] {
  const key = [r1, r2].sort((a, b) => RARITY_RANK[a] - RARITY_RANK[b]).join("+") as BreedPairKey;
  return BREED_PROBABILITIES[key] ?? [0, 0, 0, 0];
}

/**
 * Returns true when two NFTs are eligible to be bred together.
 * Breeding is allowed between NFTs of the same rarity or adjacent
 * rarity levels (rank difference ≤ 1).
 *
 * Valid pairs: common↔common, common↔rare, rare↔rare,
 *              rare↔legendary, legendary↔legendary,
 *              legendary↔transcendent, transcendent↔transcendent
 */
export function canBreed(r1: NFTRarity, r2: NFTRarity): boolean {
  return Math.abs(RARITY_RANK[r1] - RARITY_RANK[r2]) <= 1;
}
