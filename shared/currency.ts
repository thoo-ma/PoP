/**
 * POOP currency constants — single source of truth for frontend and
 * Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/currency.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTRarity } from './nft.ts'
import type { NFTType } from './nft.ts'

// ─── Repair cost formula ─────────────────────────────────────────────────────
// Cost ($) = (REPAIR_COEF_A × level² + REPAIR_COEF_B) × RarityMultiplier
// Tokens   = Math.round(Cost $ / REPAIR_USD_PER_TOKEN × energyRestored / MAX_ENERGY)
//
// Rounding: Math.round (standard half-up). If a different strategy is ever
// needed, replace Math.round with Math.floor or Math.ceil here.
//
// Note: the design splits cost 50/50 between $POOP and $PAPER. The $PAPER
// half is not yet implemented — the full token amount is charged in POOP only.

// @migration: DELETE — game_config.currency
export const REPAIR_COEF_A = 0.85
// @migration: DELETE — game_config.currency
export const REPAIR_COEF_B = 4.15
// @migration: DELETE — game_config.currency
export const REPAIR_USD_PER_TOKEN = 0.002

// @migration: DELETE — game_config.currency
export const REPAIR_RARITY_MULTIPLIER: Record<NFTRarity, number> = {
  common: 1.0,
  rare: 1.2,
  legendary: 1.5,
  transcendent: 2.0,
}

/**
 * Repair cost in $POOP tokens for a given NFT and energy amount to restore.
 *
 * @param level          NFT's current level (1–20)
 * @param rarity         NFT's rarity tier
 * @param energyRestored Amount of energy being restored (Δenergy)
 * @param maxEnergy      Maximum possible energy (used to scale the cost)
 * @param cfg            Optional DB config override (falls back to module constants)
 */
export function repairCost(
  level: number,
  rarity: NFTRarity,
  energyRestored: number,
  maxEnergy: number,
  cfg?: {
    REPAIR_COEF_A?: number
    REPAIR_COEF_B?: number
    REPAIR_USD_PER_TOKEN?: number
    REPAIR_RARITY_MULTIPLIER?: Record<NFTRarity, number>
  },
): number {
  const a = cfg?.REPAIR_COEF_A ?? REPAIR_COEF_A
  const b = cfg?.REPAIR_COEF_B ?? REPAIR_COEF_B
  const usdPerToken = cfg?.REPAIR_USD_PER_TOKEN ?? REPAIR_USD_PER_TOKEN
  const rarityMult = cfg?.REPAIR_RARITY_MULTIPLIER ?? REPAIR_RARITY_MULTIPLIER
  const fullCostUsd = (a * level ** 2 + b) * rarityMult[rarity]
  const fullCostTokens = fullCostUsd / usdPerToken
  return Math.round((energyRestored / maxEnergy) * fullCostTokens)
}

// ─── Breed cost formula ───────────────────────────────────────────────────────
// Cost ($) = BREED_BASE_PRICE_USD × BREED_GROWTH_RATE^breedCount × RarityMultiplier
// Tokens   = Math.round(Cost $ / BREED_USD_PER_TOKEN)
//
// breedCount is the number of times this individual NFT has already been used
// as a parent (0–5). Both parents are charged independently; the caller sums
// the two costs.  At breedCount = BREED_MAX_COUNT the breed-nfts edge function
// blocks the operation before this function is even reached.
//
// Reference table ($ amounts):
//   breedCount │ Common (×1) │ Rare (×8) │ Legendary (×40) │ Transcendent (×150)
//   ───────────┼─────────────┼───────────┼─────────────────┼────────────────────
//       0      │    $0.20    │   $1.60   │      $8.00      │      $30.00
//       1      │    $0.50    │   $4.00   │     $20.00      │      $75.00
//       2      │    $1.25    │  $10.00   │     $50.00      │     $187.50
//       3      │    $3.13    │  $25.00   │    $125.00      │     $468.75
//       4      │    $7.81    │  $62.50   │    $312.50      │   $1 171.88
//       5      │   $19.53    │ $156.25   │    $781.25      │   $2 929.69

/** Base breed price in USD at breedCount = 0. */
// @migration: DELETE — game_config.currency
export const BREED_BASE_PRICE_USD = 0.2
/** Exponential growth rate per breed level. */
// @migration: DELETE — game_config.currency
export const BREED_GROWTH_RATE = 2.5
/** USD value of one $POOP token (consistent with REPAIR_USD_PER_TOKEN). */
// @migration: DELETE — game_config.currency
export const BREED_USD_PER_TOKEN = 0.002
/** Maximum number of times an NFT can be used as a parent (inclusive). */
// @migration: DELETE — game_config.currency
export const BREED_MAX_COUNT = 5

// @migration: DELETE — game_config.currency
export const BREED_RARITY_MULTIPLIER: Record<NFTRarity, number> = {
  common: 1,
  rare: 8,
  legendary: 40,
  transcendent: 150,
}

/**
 * Breed cost in $POOP tokens for a single parent NFT.
 *
 * Call once per parent and sum the results for the total session cost.
 *
 * @param breedCount  How many times this NFT has already been bred (0–5)
 * @param rarity      This NFT's rarity tier
 * @param cfg         Optional DB config override (falls back to module constants)
 */
export function breedCost(
  breedCount: number,
  rarity: NFTRarity,
  cfg?: {
    BREED_BASE_PRICE_USD?: number
    BREED_GROWTH_RATE?: number
    BREED_USD_PER_TOKEN?: number
    BREED_RARITY_MULTIPLIER?: Record<NFTRarity, number>
  },
): number {
  const base = cfg?.BREED_BASE_PRICE_USD ?? BREED_BASE_PRICE_USD
  const growth = cfg?.BREED_GROWTH_RATE ?? BREED_GROWTH_RATE
  const usdPerToken = cfg?.BREED_USD_PER_TOKEN ?? BREED_USD_PER_TOKEN
  const rarityMult = cfg?.BREED_RARITY_MULTIPLIER ?? BREED_RARITY_MULTIPLIER
  const costUsd = base * growth ** breedCount * rarityMult[rarity]
  return Math.round(costUsd / usdPerToken)
}

// ─── Use reward formula ───────────────────────────────────────────────────────
// Reward ($) = REWARD_BASE_PRICE_USD × REWARD_GROWTH_RATE^(level-1) × TypeMultiplier × RarityMultiplier
// Tokens     = Math.round(Reward $ / REWARD_USD_PER_TOKEN)
//
// Level is the NFT's current level (1–20); level-1 is used so the base price
// applies at level 1 (exponent = 0).

/** Base reward in USD at level 1. */
// @migration: DELETE — game_config.currency
export const REWARD_BASE_PRICE_USD = 0.004
/** Exponential growth rate per level. */
// @migration: DELETE — game_config.currency
export const REWARD_GROWTH_RATE = 1.08
/** USD value of one $POOP token. */
// @migration: DELETE — game_config.currency
export const REWARD_USD_PER_TOKEN = 0.002

// @migration: DELETE — game_config.currency
export const REWARD_RARITY_MULTIPLIER: Record<NFTRarity, number> = {
  common: 1,
  rare: 2,
  legendary: 5,
  transcendent: 12,
}

// @migration: DELETE — game_config.currency
export const REWARD_TYPE_MULTIPLIER: Record<NFTType, number> = {
  'turbo-flush': 1.5,
  'cruise-seat': 1.0,
  'zen-fortress': 0.8,
}

/**
 * POOP tokens earned for a single NFT use.
 *
 * @param type   NFT type
 * @param rarity NFT rarity tier
 * @param level  NFT's current level (1–20)
 * @param cfg    Optional DB config override (falls back to module constants)
 */
export function calcPoopEarned(
  type: NFTType,
  rarity: NFTRarity,
  level: number,
  cfg?: {
    REWARD_BASE_PRICE_USD?: number
    REWARD_GROWTH_RATE?: number
    REWARD_USD_PER_TOKEN?: number
    REWARD_TYPE_MULTIPLIER?: Record<NFTType, number>
    REWARD_RARITY_MULTIPLIER?: Record<NFTRarity, number>
  },
): number {
  const base = cfg?.REWARD_BASE_PRICE_USD ?? REWARD_BASE_PRICE_USD
  const growth = cfg?.REWARD_GROWTH_RATE ?? REWARD_GROWTH_RATE
  const usdPerToken = cfg?.REWARD_USD_PER_TOKEN ?? REWARD_USD_PER_TOKEN
  const typeMult = cfg?.REWARD_TYPE_MULTIPLIER ?? REWARD_TYPE_MULTIPLIER
  const rarityMult = cfg?.REWARD_RARITY_MULTIPLIER ?? REWARD_RARITY_MULTIPLIER
  const rewardUsd = base * growth ** (level - 1) * typeMult[type] * rarityMult[rarity]
  return Math.max(1, Math.round(rewardUsd / usdPerToken))
}
