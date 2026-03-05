/**
 * Energy drain constants — single source of truth for dashboard and
 * Supabase Edge Functions.
 *
 * Previously hardcoded in supabase/functions/use-nft/index.ts.
 *
 * Formula:
 *   loss = random[ROLL_MIN, ROLL_MAX) × (1 - resilience/100) × TYPE_DRAIN_MULT[type]
 *
 * Supabase imports via:   ../../../shared/energyDrain.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

import type { NFTType } from './nft.ts';

/**
 * Per-type energy drain multiplier.
 * Higher = faster drain. turbo-flush punishes; zen-fortress rewards patience.
 */
// @migration: DELETE — game_config.energy_drain
export const TYPE_DRAIN_MULT: Record<NFTType, number> = {
  'turbo-flush':  3,
  'cruise-seat':  1.5,
  'zen-fortress': 1,
};

/** Minimum of the base energy loss roll (inclusive). */
// @migration: DELETE — game_config.energy_drain
export const ENERGY_ROLL_MIN = 5;

/** Maximum of the base energy loss roll (exclusive). */
// @migration: DELETE — game_config.energy_drain
export const ENERGY_ROLL_MAX = 15;
