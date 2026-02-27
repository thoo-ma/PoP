/**
 * XP system — single source of truth shared by the `use-nft` edge function and
 * the frontend NFTCard XP bar.
 *
 * XP is tracked within the current level and resets to the remainder on
 * level-up.
 *
 * Both the per-poop XP gain and the level-advance threshold use the same
 * formula so tuning one tunes both:
 *
 *   value(level) = round(25 + level × 5 + level² × 0.3)
 *
 * Level 1 has a minimum floor of 33 (matches the design table).
 * Levels: 1 – MAX_LEVEL. The bar at MAX_LEVEL fills to xpThreshold(MAX_LEVEL).
 */

export const MAX_LEVEL = 20

function xpFormula(level: number): number {
  return Math.round(25 + level * 5 + Math.pow(level, 2) * 0.3)
}

/** XP threshold to advance from `level` to `level + 1`. */
export function xpThreshold(level: number): number {
  return Math.max(33, xpFormula(level))
}

/** XP earned by using an NFT that is currently at `level`. */
export function calcXPGain(level: number): number {
  return xpFormula(level)
}

/**
 * Apply XP gain to the current (xp, level) pair and return the updated values.
 * XP resets to the remainder when the threshold is crossed; levels cap at MAX_LEVEL.
 */
export function applyXP(
  currentXP: number,
  currentLevel: number,
  gained: number,
): { newXP: number; newLevel: number; leveledUp: boolean; levelsGained: number } {
  let xp    = currentXP + gained
  let level = currentLevel
  let levelsGained = 0

  while (level < MAX_LEVEL && xp >= xpThreshold(level)) {
    xp -= xpThreshold(level)
    level++
    levelsGained++
  }

  // At max level, cap the bar so it never overflows the display maximum.
  if (level === MAX_LEVEL) {
    xp = Math.min(xp, xpThreshold(MAX_LEVEL))
  }

  return { newXP: xp, newLevel: level, leveledUp: levelsGained > 0, levelsGained }
}
