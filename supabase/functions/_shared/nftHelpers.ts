import { TYPE_NAMES, NFT_TYPES, type NFTRarity as Rarity, type NFTType } from '../../../shared/nft.ts'

// ─── Constants ─────────────────────────────────────────────────────────────

/**
 * Per-rarity stat ranges for freshly minted (non-bred) NFTs.
 * Higher rarity boxes produce higher base stats.
 */
export const STAT_RANGES: Record<Rarity, [number, number]> = {
  common:       [40, 70],
  rare:         [50, 80],
  legendary:    [60, 90],
  transcendent: [70, 100],
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Returns a random NFT type with equal probability. */
export function randomType(): NFTType {
  return NFT_TYPES[Math.floor(Math.random() * NFT_TYPES.length)]
}

/** Returns a random name slug for the given NFT type. */
export function randomName(type: NFTType): string {
  const names = TYPE_NAMES[type]
  return names[Math.floor(Math.random() * names.length)]
}

/**
 * Rolls a single stat value within the rarity-appropriate range.
 * Used when minting first-generation NFTs (e.g. from mystery boxes).
 */
export function rollStat(rarity: Rarity): number {
  const [min, max] = STAT_RANGES[rarity]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Constructs the public storage URL for a toilet NFT image. */
export function buildImageUrl(type: NFTType, name: string, rarity: Rarity): string {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  return `${supabaseUrl}/storage/v1/object/public/assets/toilets/${type}/${name}/${name}-${rarity}.jpg`
}
