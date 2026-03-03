/**
 * POOP currency constants — single source of truth for frontend and
 * Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/currency.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTRarity } from './nft.ts';

/** POOP earned each time a user successfully uses (poops) an NFT. */
export const POOP_PER_USE = 10;

// ─── Repair cost formula ─────────────────────────────────────────────────────
// Cost ($) = (REPAIR_COEF_A × level² + REPAIR_COEF_B) × RarityMultiplier
// Tokens   = Math.round(Cost $ / REPAIR_USD_PER_TOKEN × energyRestored / MAX_ENERGY)
//
// Rounding: Math.round (standard half-up). If a different strategy is ever
// needed, replace Math.round with Math.floor or Math.ceil here.
//
// Note: the design splits cost 50/50 between $POOP and $PAPER. The $PAPER
// half is not yet implemented — the full token amount is charged in POOP only.

export const REPAIR_COEF_A = 0.85;
export const REPAIR_COEF_B = 4.15;
export const REPAIR_USD_PER_TOKEN = 0.002;

export const REPAIR_RARITY_MULTIPLIER: Record<NFTRarity, number> = {
  common:       1.0,
  rare:         1.2,
  legendary:    1.5,
  transcendent: 2.0,
};

/**
 * Repair cost in $POOP tokens for a given NFT and energy amount to restore.
 *
 * @param level          NFT's current level (1–20)
 * @param rarity         NFT's rarity tier
 * @param energyRestored Amount of energy being restored (Δenergy)
 * @param maxEnergy      Maximum possible energy (used to scale the cost)
 */
export function repairCost(
  level: number,
  rarity: NFTRarity,
  energyRestored: number,
  maxEnergy: number,
): number {
  const fullCostUsd = (REPAIR_COEF_A * Math.pow(level, 2) + REPAIR_COEF_B) * REPAIR_RARITY_MULTIPLIER[rarity];
  const fullCostTokens = fullCostUsd / REPAIR_USD_PER_TOKEN;
  return Math.round((energyRestored / maxEnergy) * fullCostTokens);
}

/** POOP charged each time a user breeds two NFTs. */
export const POOP_BREED_COST = 5;
