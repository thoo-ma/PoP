import { TYPE_NAMES, NFT_TYPES, type NFTRarity as Rarity, type NFTType } from '../../../shared/src/nft.ts'
import { STAT_RANGES } from '../../../shared/src/minting.ts'
import { secureRandom } from './random.ts'

export { STAT_RANGES }

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Returns a random NFT type with equal probability. */
export function randomType(): NFTType {
  return NFT_TYPES[Math.floor(secureRandom() * NFT_TYPES.length)]
}

/** Returns a random name slug for the given NFT type. */
export function randomName(type: NFTType): string {
  const names = TYPE_NAMES[type]
  return names[Math.floor(secureRandom() * names.length)]
}

/**
 * Rolls a single stat value within the rarity-appropriate range.
 * Used when minting first-generation NFTs (e.g. from mystery boxes).
 */
export function rollStat(
  rarity: Rarity,
  cfg?: { STAT_RANGES?: Record<Rarity, [number, number]> },
): number {
  const ranges = cfg?.STAT_RANGES ?? STAT_RANGES
  const [min, max] = ranges[rarity]
  return Math.floor(secureRandom() * (max - min + 1)) + min
}

/** Constructs the public storage URL for a toilet NFT image. */
export function buildImageUrl(type: NFTType, name: string, rarity: Rarity): string {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  return `${supabaseUrl}/storage/v1/object/public/assets/toilets/${type}/${name}/${name}-${rarity}.jpg`
}

/** Constructs the public storage URL for a mystery box image. */
export function buildMysteryBoxImageUrl(rarity: Rarity): string {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  return `${supabaseUrl}/storage/v1/object/public/assets/mystery-boxes/${rarity}.jpg`
}
