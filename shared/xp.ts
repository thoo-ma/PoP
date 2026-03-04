/**
 * XP system — single source of truth shared by the `use-nft` edge function and
 * the frontend NFTCard XP bar.
 *
 * XP is tracked within the current level and resets to the remainder on
 * level-up.
 *
 * XP required to advance from level N to N+1:
 *
 *   xpThreshold(level) = max(33, round(25 + level × 5 + level² × 0.3))
 *
 * XP earned per NFT use: XP_PER_USE (flat, level-independent).
 *
 * Levels: 1 – MAX_LEVEL. The bar at MAX_LEVEL fills to xpThreshold(MAX_LEVEL).
 *
 * ┌───────┬───────────────────────┬──────────────────────────┐
 * │ Level │ XP to reach next level│ Uses needed (@ 15 XP/use)│
 * ├───────┼───────────────────────┼──────────────────────────┤
 * │   1   │          33           │            3             │
 * │   2   │          36           │            3             │
 * │   3   │          43           │            3             │
 * │   4   │          50           │            4             │
 * │   5   │          58           │            4             │
 * │   6   │          66           │            5             │
 * │   7   │          75           │            5             │
 * │   8   │          84           │            6             │
 * │   9   │          94           │            7             │
 * │  10   │         105           │            7             │
 * │  11   │         116           │            8             │
 * │  12   │         128           │            9             │
 * │  13   │         141           │           10             │
 * │  14   │         154           │           11             │
 * │  15   │         168           │           12             │
 * │  16   │         182           │           13             │
 * │  17   │         197           │           14             │
 * │  18   │         212           │           15             │
 * │  19   │         228           │           16             │
 * │  20   │         245  (max)    │            —             │
 * └───────┴───────────────────────┴──────────────────────────┘
 */

export const MAX_LEVEL = 20
export const XP_PER_USE = 15

// ─── XP formula coefficients ─────────────────────────────────────────────────
// xpThreshold(level) = max(FLOOR, round(BASE + level × LINEAR + level² × QUADRATIC))

export const XP_FORMULA_BASE = 25
export const XP_FORMULA_LINEAR = 5
export const XP_FORMULA_QUADRATIC = 0.3
export const XP_FORMULA_FLOOR = 33

function xpFormula(level: number): number {
  return Math.round(XP_FORMULA_BASE + level * XP_FORMULA_LINEAR + Math.pow(level, 2) * XP_FORMULA_QUADRATIC)
}

/** XP threshold to advance from `level` to `level + 1`. */
export function xpThreshold(level: number): number {
  return Math.max(XP_FORMULA_FLOOR, xpFormula(level))
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
