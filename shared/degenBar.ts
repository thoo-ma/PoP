/**
 * Degen Bar formula functions — pure, side-effect-free.
 *
 * The Degen Bar is a risk slider (0–100%) on paid actions.
 * Higher degen % → bigger cost reduction, higher bust probability.
 *
 * Supabase imports via:   ../../../shared/degenBar.ts
 * Frontend imports via:   @pop/shared/degenBar
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

// ─── Formulas ─────────────────────────────────────────────────────────────────

/**
 * Cost reduction fraction (0–0.75) at the given degen level.
 *
 * @param degenPercent  0–100 (clamped internally)
 * @param cfg           Optional DB config override
 */
export function calcReduction(degenPercent: number, cfg?: DegenBarCfg): number {
  const maxReduction = cfg?.MAX_REDUCTION ?? MAX_REDUCTION;
  return Math.min(100, Math.max(0, degenPercent)) * maxReduction / 100;
}

/**
 * Bust probability (0–0.30) at the given degen level.
 *
 * - SAFE zone (< DEGEN_ZONE_THRESHOLD):  linear ramp via SAFE_BUST_COEF
 * - DEGEN zone (≥ DEGEN_ZONE_THRESHOLD): quadratic ramp via DEGEN_BUST_BASE + f² × DEGEN_BUST_SCALE
 *
 * @param degenPercent  0–100
 * @param cfg           Optional DB config override
 */
export function calcBustChance(degenPercent: number, cfg?: DegenBarCfg): number {
  const safeBustCoef       = cfg?.SAFE_BUST_COEF        ?? SAFE_BUST_COEF;
  const degenBustBase      = cfg?.DEGEN_BUST_BASE       ?? DEGEN_BUST_BASE;
  const degenBustScale     = cfg?.DEGEN_BUST_SCALE      ?? DEGEN_BUST_SCALE;
  const degenZoneThreshold = cfg?.DEGEN_ZONE_THRESHOLD  ?? DEGEN_ZONE_THRESHOLD;

  // Guard: if threshold >= 100 the degen zone is unreachable; stay in SAFE zone.
  if (degenPercent < degenZoneThreshold || degenZoneThreshold >= 100) {
    return degenPercent * safeBustCoef / 100;
  }
  const f = (degenPercent - degenZoneThreshold) / (100 - degenZoneThreshold);
  return (degenBustBase + f * f * degenBustScale) / 100;
}

/**
 * Reduced cost (in tokens) after applying the degen discount.
 * Always at least 1.
 *
 * @param baseCost      Original cost before any discount
 * @param degenPercent  0–100
 * @param cfg           Optional DB config override
 */
export function calcReducedCost(baseCost: number, degenPercent: number, cfg?: DegenBarCfg): number {
  return Math.max(1, Math.round(baseCost * (1 - calcReduction(degenPercent, cfg))));
}

/**
 * Roll a degen outcome: busted or not.
 * Uses `crypto.getRandomValues` for cryptographically unbiased randomness.
 *
 * @param degenPercent  0–100
 * @param cfg           Optional DB config override
 */
export function resolveDegenOutcome(degenPercent: number, cfg?: DegenBarCfg): DegenOutcome {
  const roll = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
  return { busted: roll < calcBustChance(degenPercent, cfg) };
}

/** Canonical key order for the degen bar config fingerprint. Used by both client and server. */
export const DEGEN_BAR_HASH_KEYS = ['SAFE_BUST_COEF', 'DEGEN_BUST_BASE', 'DEGEN_BUST_SCALE', 'DEGEN_ZONE_THRESHOLD', 'MAX_REDUCTION'] as const;

/**
 * Deterministic string fingerprint of a DegenBarCfg value.
 * Used by client-side hooks to detect server-side config drift.
 */
export function degenBarConfigHash(cfg: DegenBarCfg): string {
  return JSON.stringify(Object.fromEntries(DEGEN_BAR_HASH_KEYS.map((k) => [k, cfg[k]])));
}
