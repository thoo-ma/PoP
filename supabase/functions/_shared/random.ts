/**
 * Returns a cryptographically secure uniform random float in [0, 1).
 *
 * Uses `crypto.getRandomValues()` (Web Crypto API, available natively in Deno)
 * instead of `Math.random()` for outcomes that affect the in-game economy
 * (loot rolls, rarity tiers, energy drain, stat rolls).
 *
 * Note: divisor is `2 ** 32` (not `2 ** 32 - 1`) so the result is strictly
 * less than 1; this preserves the `[0, 1)` semantics of `Math.random()` and
 * keeps `Math.floor(secureRandom() * len)` safely in `[0, len - 1]`.
 */
export function secureRandom(): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] / 2 ** 32
}
