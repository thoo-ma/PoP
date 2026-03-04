import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { repairCost } from '../../../shared/currency.ts'
import type { NFTRarity } from '../../../shared/nft.ts'
import { MAX_ENERGY } from '../../../shared/statPoints.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'

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
    const body = await req.json()
    const { nft_id, new_energy } = body

    if (!nft_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'nft_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (typeof new_energy !== 'number' || new_energy < 0 || new_energy > MAX_ENERGY) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: `new_energy must be a number between 0 and ${MAX_ENERGY}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchNFTError } = await supabase
      .from('nfts')
      .select('id, energy, level, rarity')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchNFTError || !nft) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'NFT not found or not owned by you' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (new_energy <= nft.energy) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: `new_energy (${new_energy}) must be greater than current energy (${nft.energy})`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: userFetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const currentPoopBalance = userRow?.poop_balance ?? 0
    if (currentPoopBalance < poopCost) {
      return new Response(
        JSON.stringify({
          error: 'insufficient_poop',
          message: `Repairing costs ${poopCost} POOP. You have ${currentPoopBalance} POOP.`,
          poop_balance: currentPoopBalance,
          poop_required: poopCost,
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
    return new Response(
      JSON.stringify({
        id:           updated.id,
        energy:       updated.energy,
        poop_spent:   poopCost,
        poop_balance: newPoopBalance,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('repair-nft: unexpected error', err)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
