import type { DegenBarConfig } from '../../../shared/schemas.ts'
import type { SupabaseClient } from './auth.ts'
import { applyDegenBar, getWalletBalance, computeConfigHash } from './degenBar.ts'
import { respondError } from './responses.ts'

export { computeConfigHash }

export type PaymentResult = {
  chargedAmount: number
  newBalance: number
}

export type ProcessPaymentOpts = {
  /** Build the 402 "insufficient funds" user-facing message. */
  insufficientMsg?: (chargedAmount: number, currentBalance: number) => string
  /** Build the 402 `details` object (e.g. per-parent cost breakdown). */
  insufficientDetails?: (chargedAmount: number, currentBalance: number) => Record<string, unknown>
}

/**
 * Charge a user via the degen bar, handling all error / bust / insufficient-funds paths.
 *
 * On success (not busted, sufficient balance): returns `{ chargedAmount, newBalance }`.
 * On any error / bust / insufficient-funds: returns a `Response` the caller should return directly.
 *
 * ```ts
 * const payment = await processPayment(supabase, userId, cost, degenPercent, 'repair', origin)
 * if (payment instanceof Response) return payment
 * const { chargedAmount, newBalance } = payment
 * ```
 */
export async function processPayment(
  supabase: SupabaseClient,
  userId: string,
  baseCost: number,
  degenPercent: number,
  action: 'repair' | 'breed',
  origin: string | null,
  cfg?: DegenBarConfig,
  opts?: ProcessPaymentOpts,
): Promise<PaymentResult | Response> {
  let chargedAmount: number
  let newBalance: number | null
  let outcome: { busted: boolean }

  try {
    const result = await applyDegenBar(supabase, userId, baseCost, degenPercent, action, cfg)
    chargedAmount = result.chargedAmount
    newBalance    = result.newBalance
    outcome       = result.outcome
  } catch (err) {
    console.error(`${action}: applyDegenBar error`, err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
      undefined, origin,
    )
  }

  if (newBalance === null) {
    let currentBalance = 0
    try {
      currentBalance = await getWalletBalance(supabase, userId)
    } catch (walletErr) {
      console.error(`${action}: getWalletBalance error`, { userId, error: walletErr })
    }

    const msg = opts?.insufficientMsg
      ? opts.insufficientMsg(chargedAmount, currentBalance)
      : `Action costs ${chargedAmount} POOP. You have ${currentBalance} POOP.`

    const details = opts?.insufficientDetails
      ? opts.insufficientDetails(chargedAmount, currentBalance)
      : { poop_balance: currentBalance, poop_required: chargedAmount }

    return respondError(402, 'insufficient_poop', msg, details, origin)
  }

  if (outcome.busted) {
    return respondError(422, 'busted', 'busted', {
      degen_percent: degenPercent,
      poop_spent:    chargedAmount,
      poop_balance:  newBalance,
      config_hash:   computeConfigHash(cfg),
    }, origin)
  }

  return { chargedAmount, newBalance }
}
