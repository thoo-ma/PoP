/**
 * Degen Bar formula functions — Phase 1.
 *
 * Pure, side-effect-free functions for computing cost reduction and bust
 * probability from a degen percentage (0–100).
 *
 * All tunable constants are marked @migration: DELETE so they can be moved
 * to the `game_config.degen_bar` row once the dashboard is wired up (Phase 3).
 *
 * Supabase imports via:   ../../../shared/degenBar.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DegenBarCfg = {
  SAFE_BUST_COEF?: number;       // default 0.08
  DEGEN_BUST_BASE?: number;      // default 2
  DEGEN_BUST_SCALE?: number;     // default 28
  DEGEN_ZONE_THRESHOLD?: number; // default 25
  MAX_REDUCTION?: number;        // default 0.75
};

export type DegenOutcome = { busted: boolean };

// ─── Constants ────────────────────────────────────────────────────────────────

/** @migration: DELETE — game_config.degen_bar */
export const SAFE_BUST_COEF = 0.08;
/** @migration: DELETE — game_config.degen_bar */
export const DEGEN_BUST_BASE = 2;
/** @migration: DELETE — game_config.degen_bar */
export const DEGEN_BUST_SCALE = 28;
/** @migration: DELETE — game_config.degen_bar */
export const DEGEN_ZONE_THRESHOLD = 25;
/** @migration: DELETE — game_config.degen_bar */
export const MAX_REDUCTION = 0.75;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Formulas ─────────────────────────────────────────────────────────────────

/**
 * Cost reduction factor for a given degen percentage.
 *
 * @returns A value in [0, 0.75].
 */
export function calcReduction(degenPercent: number, cfg?: DegenBarCfg): number {
  const maxReduction = cfg?.MAX_REDUCTION ?? MAX_REDUCTION;
  return clamp(degenPercent, 0, 100) * maxReduction / 100;
}

/**
 * Bust probability for a given degen percentage.
 *
 * SAFE zone  (< threshold): linear, low probability.
 * DEGEN zone (≥ threshold): quadratic escalation.
 *
 * @returns A value in [0, 0.30].
 */
export function calcBustChance(degenPercent: number, cfg?: DegenBarCfg): number {
  const safeBustCoef   = cfg?.SAFE_BUST_COEF        ?? SAFE_BUST_COEF;
  const degenBustBase  = cfg?.DEGEN_BUST_BASE        ?? DEGEN_BUST_BASE;
  const degenBustScale = cfg?.DEGEN_BUST_SCALE       ?? DEGEN_BUST_SCALE;
  const threshold      = cfg?.DEGEN_ZONE_THRESHOLD   ?? DEGEN_ZONE_THRESHOLD;

  const pct = clamp(degenPercent, 0, 100);

  if (pct < threshold) {
    return pct * safeBustCoef / 100;
  }

  const f = (pct - threshold) / (100 - threshold);
  return (degenBustBase + f * f * degenBustScale) / 100;
}

/**
 * Apply degen reduction to a base cost, with a minimum of 1.
 *
 * @returns An integer ≥ 1.
 */
export function calcReducedCost(baseCost: number, degenPercent: number, cfg?: DegenBarCfg): number {
  return Math.max(1, Math.round(baseCost * (1 - calcReduction(degenPercent, cfg))));
}

/**
 * Roll a cryptographically-random outcome for a given degen percentage.
 *
 * Uses `crypto.getRandomValues` (available in both browser and Deno/Node).
 */
export function resolveDegenOutcome(degenPercent: number, cfg?: DegenBarCfg): DegenOutcome {
  const roll = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
  return { busted: roll < calcBustChance(degenPercent, cfg) };
}
