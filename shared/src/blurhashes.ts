/**
 * Blurhash lookup tables for static NFT and mystery-box artwork.
 *
 * Hashes are derived from the immutable Supabase Storage assets keyed by
 * (type, name, rarity) for NFTs and by rarity for mystery boxes. Values are
 * generated offline by `scripts/generate-blurhashes.ts` — DO NOT edit by
 * hand. Re-run the script whenever new artwork is added or existing artwork
 * is replaced, then commit the regenerated tables alongside the asset.
 *
 * If a key is missing the helpers return `undefined`; consumers fall back to
 * the solid placeholder background, so out-of-date tables never break image
 * rendering.
 */

import type { NFTRarity, NFTType } from './nft'

/** Composite key used to look up an NFT blurhash: `${type}/${name}/${rarity}`. */
export type NFTBlurhashKey = `${NFTType}/${string}/${NFTRarity}`

/**
 * Blurhashes for NFT artwork.
 *
 * Populated by `scripts/generate-blurhashes.ts`. Empty until the script has
 * been run with access to the source images (Supabase Storage).
 */
export const NFT_BLURHASHES: Partial<Record<NFTBlurhashKey, string>> = {
  // Generated entries go here.
}

/**
 * Blurhashes for mystery-box artwork (one per rarity).
 *
 * Populated by `scripts/generate-blurhashes.ts`. Empty until the script has
 * been run with access to the source images (Supabase Storage).
 */
export const MYSTERY_BOX_BLURHASHES: Partial<Record<NFTRarity, string>> = {
  // Generated entries go here.
}

/** Resolves the blurhash for an NFT image, or `undefined` if not yet generated. */
export function getNftBlurhash(type: NFTType, name: string, rarity: NFTRarity): string | undefined {
  return NFT_BLURHASHES[`${type}/${name}/${rarity}`]
}

/** Resolves the blurhash for a mystery-box image, or `undefined` if not yet generated. */
export function getMysteryBoxBlurhash(rarity: NFTRarity): string | undefined {
  return MYSTERY_BOX_BLURHASHES[rarity]
}
