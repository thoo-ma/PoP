/**
 * POOP currency constants — single source of truth for frontend and
 * Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/currency.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTRarity, NFTType } from './nft.ts';

// ─── Dynamic reward formula ───────────────────────────────────────────────────
//
// POOP Earned = round( TypeMult × [ Base + ((Level - 1) × RarityPoints) ^ Exponent ] )

/** Guaranteed base POOP reward per session (the Level 1 floor). */
export const POOP_REWARD_BASE = 35;

/** Exponential scaling factor applied to accumulated efficiency points. */
export const POOP_REWARD_EXPONENT = 1.15;

/** Efficiency points gained per level-up, keyed by rarity. */
export const POOP_EFFICIENCY_PER_LEVEL: Record<NFTRarity, number> = {
  common:       2,
  rare:         4,
  legendary:    6,
  transcendent: 9,
};

/**
 * Per-session POOP reward multiplier for each NFT type.
 * Zen Fortress sessions are longer/harder so they pay 3×;
 * Turbo Flush is quick so it stays at 1×.
 */
export const POOP_TYPE_REWARD_MULT: Record<NFTType, number> = {
  'turbo-flush':  1,
  'cruise-seat':  1.5,
  'zen-fortress': 3,
};

/**
 * Calculate the POOP reward for a single NFT use.
 *
 * Formula:
 *   POOP = round( TypeMult × [ Base + ((Level - 1) × RarityPoints) ^ Exponent ] )
 *
 * Examples (Base = 35, Exponent = 1.15):
 *   L1  common       turbo-flush  →  35 POOP
 *   L10 rare         cruise-seat  →  ~65 POOP
 *   L20 transcendent zen-fortress → ~182 POOP
 */
export function calcPoopEarned(type: NFTType, rarity: NFTRarity, level: number): number {
  const rarityPts   = POOP_EFFICIENCY_PER_LEVEL[rarity] ?? 2;
  const typeMult    = POOP_TYPE_REWARD_MULT[type]       ?? 1;
  const accumulated = (level - 1) * rarityPts;
  const scaled      = accumulated > 0 ? Math.pow(accumulated, POOP_REWARD_EXPONENT) : 0;
  return Math.round(typeMult * (POOP_REWARD_BASE + scaled));
}

/**
 * POOP charged each time a user repairs an NFT (flat fee, regardless
 * of how much energy is restored).
 */
export const POOP_REPAIR_COST = 2;

/** POOP charged each time a user breeds two NFTs. */
export const POOP_BREED_COST = 5;
