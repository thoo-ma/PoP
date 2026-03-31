import { repairCost } from '../../../shared/currency.ts'
import type { NFTRarity } from '../../../shared/nft.ts'
import { MAX_ENERGY } from '../../../shared/statPoints.ts'
import { requireAuth, getCorsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'
import { parseDegenPercent, applyDegenBar, computeConfigHash, getWalletBalance } from '../_shared/degenBar.ts'

const RepairSchema = z.object({
  nft_id:        z.string().uuid('nft_id must be a valid UUID'),
  new_energy:    z.number().int().min(0).max(MAX_ENERGY,
    `new_energy must be between 0 and ${MAX_ENERGY}`),
  degen_percent: z.number().int().min(0).max(100).default(0).optional(),
})

// ─── Edge Function entry point ────────────────────────────────────────────────

export async function handleRepairNft(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req.headers.get('origin')) })
  }

  const origin = req.headers.get('origin')

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = await requireAuth(req, 'repair-nft')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    const cfg = await getGameConfig(supabase)

    console.log(`repair-nft: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const bodyResult = await parseBody(req, RepairSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { nft_id, new_energy } = bodyResult

    // ── Degen percent ─────────────────────────────────────────────────────────
    let degenPercent: number
    try {
      degenPercent = parseDegenPercent(bodyResult)
    } catch {
      return respondError(400, 'bad_request', 'degen_percent must be an integer between 0 and 100', undefined, origin)
    }

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchNFTError } = await supabase
      .from('nfts')
      .select('id, energy, level, rarity')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchNFTError || !nft) {
      return respondError(404, 'not_found', 'NFT not found or not owned by you', undefined, origin)
    }

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
    let chargedAmount: number
    let newBalance: number | null
    let outcome: { busted: boolean }
    try {
      const result = await applyDegenBar(supabase, userId, poopCost, degenPercent, 'repair', cfg.degen_bar)
      chargedAmount = result.chargedAmount
      newBalance    = result.newBalance
      outcome       = result.outcome
    } catch (degenErr) {
      console.error('repair-nft: applyDegenBar error', degenErr)
      return respondError(500, 'internal_error',
        degenErr instanceof Error ? degenErr.message : 'Unknown error',
        undefined, origin,
      )
    }

    console.log(`repair-nft: degen — percent=${degenPercent}, busted=${outcome.busted}, charged=${chargedAmount}`)

    if (newBalance === null) {
      let currentBalance = 0
      try {
        currentBalance = await getWalletBalance(supabase, userId)
      } catch (walletErr) {
        console.error('repair-nft: getWalletBalance error', { userId, error: walletErr })
        // non-fatal; fall back to 0
      }
      return respondError(402, 'insufficient_poop',
        `Repairing costs ${chargedAmount} POOP. You have ${currentBalance} POOP.`,
        { poop_balance: currentBalance, poop_required: chargedAmount }, origin,
      )
    }

    // ── Bust: charge full price, skip energy restore ──────────────────────────
    if (outcome.busted) {
      return respondError(422, 'busted', 'busted', {
        degen_percent: degenPercent,
        poop_spent:   chargedAmount,
        poop_balance: newBalance,
        config_hash:  computeConfigHash(cfg.degen_bar),
      }, origin)
    }

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
