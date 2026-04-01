import { repairCost } from '../../../shared/currency.ts'
import type { NFTRarity } from '../../../shared/nft.ts'
import { MAX_ENERGY } from '../../../shared/statPoints.ts'
import { initHandler } from '../_shared/handlerInit.ts'
import { fetchOwned } from '../_shared/fetchOwned.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'
import { processPayment, computeConfigHash } from '../_shared/processPayment.ts'

const RepairSchema = z.object({
  nft_id:        z.string().uuid('nft_id must be a valid UUID'),
  new_energy:    z.number().int().min(0).max(MAX_ENERGY,
    `new_energy must be between 0 and ${MAX_ENERGY}`),
  degen_percent: z.number().int().min(0).max(100).default(0),
})

// ─── Edge Function entry point ────────────────────────────────────────────────

export async function handleRepairNft(req: Request): Promise<Response> {
  const init = await initHandler(req, 'repair-nft')
  if (init instanceof Response) return init
  const { origin, userId, supabase } = init

  try {
    const cfg = await getGameConfig(supabase)

    console.log(`repair-nft: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const bodyResult = await parseBody(req, RepairSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { nft_id, new_energy, degen_percent: degenPercent } = bodyResult

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const nft = await fetchOwned<{ id: string; energy: number; level: number; rarity: string }>(supabase, 'nfts', nft_id, userId, 'id, energy, level, rarity', origin)
    if (nft instanceof Response) return nft

    if (new_energy <= nft.energy) {
      return respondError(400, 'bad_request',
        `new_energy (${new_energy}) must be greater than current energy (${nft.energy})`,
        undefined, origin,
      )
    }

    // ── Dynamic repair cost ───────────────────────────────────────────────────
    // Formula: Cost($) = (0.85 × level² + 4.15) × RarityMultiplier
    // Tokens  = Math.round(Cost$ / USD_PER_TOKEN × Δenergy / MAX_ENERGY)
    // The $PAPER split from the design is not yet implemented;
    // the full token amount is charged in POOP only.
    const energyDelta = new_energy - nft.energy
    const poopCost = repairCost(nft.level, nft.rarity as NFTRarity, energyDelta, MAX_ENERGY, cfg.currency)

    // ── Apply degen bar + POOP decrement ────────────────────────────────────
    console.log(`repair-nft: degen — percent=${degenPercent}`)
    const payment = await processPayment(supabase, userId, poopCost, degenPercent, 'repair', origin, cfg.degen_bar, {
      insufficientMsg: (charged, balance) =>
        `Repairing costs ${charged} POOP. You have ${balance} POOP.`,
      insufficientDetails: (charged, balance) => ({
        poop_balance: balance,
        poop_required: charged,
      }),
    })
    if (payment instanceof Response) return payment
    const { chargedAmount, newBalance } = payment

    console.log(`repair-nft: degen — percent=${degenPercent}, charged=${chargedAmount}`)

    // ── Persist NFT energy ────────────────────────────────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('nfts')
      .update({ energy: new_energy })
      .eq('id', nft_id)
      .eq('user_id', userId)   // defence-in-depth ownership check
      .select('id, energy')
      .single()

    if (updateError) {
      console.error('repair-nft: update error', updateError)
      return respondError(500, 'internal_error', updateError.message, undefined, origin)
    }

    console.log(
      `repair-nft: nft=${nft_id} energy ${nft.energy} → ${updated.energy} | ` +
      `user ${userId} spent ${chargedAmount} POOP → balance ${newBalance}`
    )

    // ── Return result ─────────────────────────────────────────────────────────
    return respondOk({
      id:            updated.id,
      energy:        updated.energy,
      poop_spent:    chargedAmount,
      poop_balance:  newBalance,
      degen_percent: degenPercent,
      original_cost: poopCost,
      reduced_cost:  chargedAmount,
      config_hash:   computeConfigHash(cfg.degen_bar),
    }, origin)

  } catch (err) {
    console.error('repair-nft: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
      undefined, origin,
    )
  }
}
