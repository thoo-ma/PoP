/**
 * Loot roll constants — single source of truth for dashboard and
 * Supabase Edge Functions.
 *
 * Previously hardcoded inline in roll-loot/index.ts and hold-loot-roll/index.ts.
 *
 * Probability formula:
 *   P(win) = BASE_WIN_PROBABILITY + holds × PER_HOLD_INCREMENT
 *
 * Supabase imports via:   ../../../shared/lootRoll.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

/** Base probability of winning a loot roll (10%). */
export const BASE_WIN_PROBABILITY = 0.1

/** Additional probability per hold (each hold adds 10%). */
export const PER_HOLD_INCREMENT = 0.1

/** Maximum number of holds allowed per loot roll session. */
export const MAX_HOLDS = 3
