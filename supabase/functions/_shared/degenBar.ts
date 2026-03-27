/**
 * degenBar — shared helper for edge functions.
 *
 * Wraps the pure formula functions from shared/degenBar.ts into
 * two utilities that are used by repair-nft and breed-nfts:
 *
 *  - parseDegenPercent(body) → validated integer (0 if omitted)
 *  - applyDegenBar(supabase, userId, baseCost, degenPercent, action, cfg?)
 *      → { chargedAmount, newBalance, outcome }
 *  - computeConfigHash(cfg) → deterministic 8-char hex string
 */

import { z } from 'zod'
import {
  calcReducedCost,
  resolveDegenOutcome,
  type DegenOutcome,
} from '../../../shared/degenBar.ts'
import type { DegenBarConfig } from '../../../shared/schemas.ts'
import { createClient } from '@supabase/supabase-js'

// deno-lint-ignore no-explicit-any
type SupabaseClient = ReturnType<typeof createClient<any>>

// ─── parseDegenPercent ────────────────────────────────────────────────────────

const DegenPercentSchema = z.object({
  degen_percent: z.number().int().min(0).max(100).default(0),
})

/**
 * Parse and validate `degen_percent` from a request body (already decoded).
 * Returns 0 when the field is absent (backward-compatible default).
 * Throws a Zod error on invalid input (caller should catch → 400).
 */
export function parseDegenPercent(body: unknown): number {
  return DegenPercentSchema.parse(body).degen_percent
}

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

/**
 * Deterministic first-8-hex-chars SHA-256 of the 5 degen_bar config values.
 * Included in responses so the frontend can detect config drift.
 */
export async function computeConfigHash(cfg: DegenBarConfig): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify({
    SAFE_BUST_COEF:       cfg.SAFE_BUST_COEF,
    DEGEN_BUST_BASE:      cfg.DEGEN_BUST_BASE,
    DEGEN_BUST_SCALE:     cfg.DEGEN_BUST_SCALE,
    DEGEN_ZONE_THRESHOLD: cfg.DEGEN_ZONE_THRESHOLD,
    MAX_REDUCTION:        cfg.MAX_REDUCTION,
  }))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex.slice(0, 8)
}
