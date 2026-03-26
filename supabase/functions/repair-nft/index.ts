import { serve } from "std/http/server"
import { repairCost } from '../../../shared/currency.ts'
import type { NFTRarity } from '../../../shared/nft.ts'
import { MAX_ENERGY } from '../../../shared/statPoints.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const RepairSchema = z.object({
  nft_id:     z.string().uuid('nft_id must be a valid UUID'),
  new_energy: z.number().int().min(0).max(MAX_ENERGY,
    `new_energy must be between 0 and ${MAX_ENERGY}`),
})

// ─── Edge Function entry point ────────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchNFTError } = await supabase
      .from('nfts')
      .select('id, energy, level, rarity')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchNFTError || !nft) {
      return respondError(404, 'not_found', 'NFT not found or not owned by you')
    }

    if (new_energy <= nft.energy) {
      return respondError(400, 'bad_request',
        `new_energy (${new_energy}) must be greater than current energy (${nft.energy})`,
      )
    }

    // ── Dynamic repair cost ───────────────────────────────────────────────────
    // Formula: Cost($) = (0.85 × level² + 4.15) × RarityMultiplier
    // Tokens  = Math.round(Cost$ / USD_PER_TOKEN × Δenergy / MAX_ENERGY)
    // The $PAPER split from the design is not yet implemented;
    // the full token amount is charged in POOP only.
    const energyDelta = new_energy - nft.energy
    const poopCost = repairCost(nft.level, nft.rarity as NFTRarity, energyDelta, MAX_ENERGY, cfg.currency)

    // ── POOP balance check ────────────────────────────────────────────────────
    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('poop_balance')
      .eq('id', userId)
      .single()

    if (userFetchError) {
      console.error('repair-nft: wallet fetch error', userFetchError)
      return respondError(500, 'internal_error', userFetchError.message)
    }

    const currentPoopBalance = userRow?.poop_balance ?? 0
    if (currentPoopBalance < poopCost) {
      return respondError(402, 'insufficient_poop',
        `Repairing costs ${poopCost} POOP. You have ${currentPoopBalance} POOP.`,
        { poop_balance: currentPoopBalance, poop_required: poopCost },
      )
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
      return respondError(500, 'internal_error', updateError.message)
    }

    // ── Deduct POOP ───────────────────────────────────────────────────────────
    const newPoopBalance = currentPoopBalance - poopCost
    const { error: poopError } = await supabase
      .from('users')
      .update({ poop_balance: newPoopBalance })
      .eq('id', userId)

    if (poopError) {
      // Non-fatal: NFT already repaired; log but don't rollback
      console.error('repair-nft: poop deduction error', poopError)
    }

    console.log(
      `repair-nft: nft=${nft_id} energy ${nft.energy} → ${updated.energy} | ` +
      `user ${userId} spent ${poopCost} POOP → balance ${newPoopBalance}`
    )

    // ── Return result ─────────────────────────────────────────────────────────
    return respondOk({
      id:           updated.id,
      energy:       updated.energy,
      poop_spent:   poopCost,
      poop_balance: newPoopBalance,
    })

  } catch (err) {
    console.error('repair-nft: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
    )
  }
})
