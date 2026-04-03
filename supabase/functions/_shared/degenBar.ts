/**
 * degenBar — shared helper for edge functions.
 *
 * Wraps the pure formula functions from shared/degenBar.ts into
 * three utilities that are used by repair-nft and breed-nfts:
 *
 *  - applyDegenBar(supabase, userId, baseCost, degenPercent, action, cfg?)
 *      → { chargedAmount, newBalance, outcome }
 *  - computeConfigHash(cfg) → deterministic JSON string fingerprint
 *  - getWalletBalance(supabase, userId) → current POOP balance
 */

import {
  calcReducedCost,
  resolveDegenOutcome,
  DEGEN_BAR_HASH_KEYS,
  SAFE_BUST_COEF,
  DEGEN_BUST_BASE,
  DEGEN_BUST_SCALE,
  DEGEN_ZONE_THRESHOLD,
  MAX_REDUCTION,
  type DegenOutcome,
} from '../../../shared/degenBar.ts'
import type { DegenBarConfig } from '../../../shared/schemas.ts'
import type { SupabaseClient } from './auth.ts'

// ─── applyDegenBar ────────────────────────────────────────────────────────────

export type DegenBarResult = {
  chargedAmount: number
  newBalance: number | null
  outcome: DegenOutcome
}

/**
 * Charge a user for a paid action, optionally applying degen-bar discounts.
 *
 * When `degenPercent === 0`:
 *   - Charges `baseCost` directly via the atomic RPC.
 *   - Returns `{ busted: false }` — no `degen_outcomes` row written.
 *
 * When `degenPercent > 0`:
 *   1. Rolls for bust (server-side CSPRNG).
 *   2. On bust: charges the FULL `baseCost` (ouch).
 *   3. On success: charges the reduced cost.
 *   4. Writes a row to `degen_outcomes` for audit purposes.
 *
 * Returns NULL `newBalance` signal → caller should return HTTP 402.
 * Throws on DB error.
 */
export async function applyDegenBar(
  supabase: SupabaseClient,
  userId: string,
  baseCost: number,
  degenPercent: number,
  action: 'repair' | 'breed',
  cfg?: DegenBarConfig,
): Promise<DegenBarResult> {
  if (degenPercent === 0) {
    const { data: newBalance, error: decErr } = await supabase.rpc('decrement_poop_balance', {
      p_user_id: userId,
      p_amount: baseCost,
    })
    if (decErr) throw decErr

    return {
      chargedAmount: baseCost,
      newBalance,       // null → caller will return 402
      outcome: { busted: false },
    }
  }

  // ── Degen path ─────────────────────────────────────────────────────────────

  // Pre-flight: must be able to cover the worst-case bust cost before we roll.
  // Prevents retry-bypass: a player with < baseCost could otherwise spam retries
  // and only ever pay the reduced cost on non-bust rolls.
  const { data: wallet, error: walletErr } = await supabase
    .from('users')
    .select('poop_balance')
    .eq('id', userId)
    .single()
  if (walletErr) throw walletErr
  if ((wallet?.poop_balance ?? 0) < baseCost) {
    return { chargedAmount: baseCost, newBalance: null, outcome: { busted: false } }
  }

  const reducedCost = calcReducedCost(baseCost, degenPercent, cfg)
  const outcome     = resolveDegenOutcome(degenPercent, cfg)
  const chargedAmount = outcome.busted ? baseCost : reducedCost

  const { data: newBalance, error: decErr } = await supabase.rpc('decrement_poop_balance', {
    p_user_id: userId,
    p_amount: chargedAmount,
  })
  if (decErr) throw decErr

  // Only write audit row when balance was actually decremented
  if (newBalance !== null) {
    const { error: auditErr } = await supabase.from('degen_outcomes').insert({
      user_id:        userId,
      action,
      degen_percent:  degenPercent,
      busted:         outcome.busted,
      base_cost:      baseCost,
      charged_amount: chargedAmount,
    })
    if (auditErr) {
      // Non-fatal: log but don't fail the whole request
      console.error(`${action}: degen_outcomes insert error`, auditErr)
    }
  }

  return { chargedAmount, newBalance, outcome }
}

// ─── computeConfigHash ────────────────────────────────────────────────────────

const DEGEN_BAR_DEFAULTS: DegenBarConfig = {
  SAFE_BUST_COEF,
  DEGEN_BUST_BASE,
  DEGEN_BUST_SCALE,
  DEGEN_ZONE_THRESHOLD,
  MAX_REDUCTION,
}

/**
 * Deterministic JSON string fingerprint of the 5 degen_bar config values.
 * Key order is explicit and stable so server and client hashes always match.
 */
export function computeConfigHash(cfg?: DegenBarConfig): string {
  const c = cfg ?? DEGEN_BAR_DEFAULTS
  return JSON.stringify(Object.fromEntries(DEGEN_BAR_HASH_KEYS.map((k) => [k, c[k]])))
}

// ─── getWalletBalance ─────────────────────────────────────────────────────────

/**
 * Fetch a user's current POOP balance from the DB.
 * Throws on DB error so callers can surface a 500 rather than silently
 * reporting 0 in a 402 response.
 */
export async function getWalletBalance(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data: wallet, error } = await supabase
    .from('users')
    .select('poop_balance')
    .eq('id', userId)
    .single()
  if (error) throw error
  return wallet?.poop_balance ?? 0
}
