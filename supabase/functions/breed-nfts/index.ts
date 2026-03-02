import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { RARITY_RANK, type NFTRarity as Rarity } from '../../../shared/nft.ts'
import { buildMysteryBoxImageUrl } from '../_shared/nftHelpers.ts'
import { BREED_PROBABILITIES } from '../../../shared/breedProbabilities.ts'
import type { BreedPairKey } from '../../../shared/breedProbabilities.ts'
import { POOP_BREED_COST } from '../../../shared/currency.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'

// ─── Rarity system ───────────────────────────────────────────────────────────

function rarityKey(r1: Rarity, r2: Rarity): BreedPairKey {
  // Sort so that the lower-rank rarity always comes first
  return [r1, r2]
    .sort((a, b) => RARITY_RANK[a] - RARITY_RANK[b])
    .join('+') as BreedPairKey
}

function rollRarity(r1: Rarity, r2: Rarity): Rarity {
  const key = rarityKey(r1, r2)
  const probs = BREED_PROBABILITIES[key]
  if (!probs) throw new Error(`No probability table for combination: ${key}`)

  const roll = Math.random() * 100
  let cumulative = 0
  const rarities: Rarity[] = ['common', 'rare', 'legendary', 'transcendent']
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i]
    if (roll < cumulative) return rarities[i]
  }
  return 'transcendent' // floating-point safety fallback
}

// ─── Edge Function entry point ────────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = await requireAuth(req, 'breed-nfts')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    console.log(`breed-nfts: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const body = await req.json()
    const { parent1_id, parent2_id } = body

    if (!parent1_id || !parent2_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'parent1_id and parent2_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (parent1_id === parent2_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Cannot breed an NFT with itself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch & ownership check ───────────────────────────────────────────────
    const { data: parents, error: fetchError } = await supabase
      .from('nfts')
      .select('*')
      .in('id', [parent1_id, parent2_id])
      .eq('user_id', userId)

    if (fetchError) {
      console.error('breed-nfts: fetch parents error', fetchError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!parents || parents.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'One or both NFTs not found or not owned by you' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const p1 = parents.find((p) => p.id === parent1_id)!
    const p2 = parents.find((p) => p.id === parent2_id)!

    // ── Rarity adjacency check ────────────────────────────────────────────────
    const r1 = p1.rarity as Rarity
    const r2 = p2.rarity as Rarity
    const rankDiff = Math.abs(RARITY_RANK[r1] - RARITY_RANK[r2])

    if (rankDiff > 1) {
      return new Response(
        JSON.stringify({
          error: 'Incompatible rarities',
          message: `Cannot breed ${r1} with ${r2}. Only NFTs of the same or adjacent rarity can be bred together.`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── POOP balance check ─────────────────────────────────────────────────────
    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('poop_balance')
      .eq('id', userId)
      .single()

    if (userFetchError) {
      console.error('breed-nfts: wallet fetch error', userFetchError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: userFetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const currentPoopBalance = userRow?.poop_balance ?? 0
    if (currentPoopBalance < POOP_BREED_COST) {
      return new Response(
        JSON.stringify({
          error: 'insufficient_poop',
          message: `Breeding costs ${POOP_BREED_COST} POOP. You have ${currentPoopBalance} POOP.`,
          poop_balance: currentPoopBalance,
          poop_required: POOP_BREED_COST,
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Rarity roll ───────────────────────────────────────────────────────────
    const offspringRarity = rollRarity(r1, r2)

    console.log(`breed-nfts: ${r1}+${r2} → mystery box (${offspringRarity}) (key: ${rarityKey(r1, r2)})`)

    // ── Build mystery box ─────────────────────────────────────────────────────
    const mysteryBox = {
      user_id:   userId,
      rarity:    offspringRarity,
      image_url: buildMysteryBoxImageUrl(offspringRarity),
      opened:    false,
    }

    // ── Insert ────────────────────────────────────────────────────────────────
    const { data: created, error: insertError } = await supabase
      .from('mystery_boxes')
      .insert(mysteryBox)
      .select()
      .single()

    if (insertError) {
      console.error('breed-nfts: insert error', insertError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Deduct POOP ───────────────────────────────────────────────────────────
    const newPoopBalance = currentPoopBalance - POOP_BREED_COST
    const { error: poopError } = await supabase
      .from('users')
      .update({ poop_balance: newPoopBalance })
      .eq('id', userId)

    if (poopError) {
      // Non-fatal: offspring already created; log but don't rollback
      console.error('breed-nfts: poop deduction error', poopError)
    }

    console.log(`breed-nfts: user ${userId} spent ${POOP_BREED_COST} POOP → balance ${newPoopBalance}`)

    // ── Return new mystery box ────────────────────────────────────────────────
    const result = {
      id:         created.id,
      rarity:     created.rarity,
      image_url:  created.image_url,
      opened:     created.opened,
      created_at: created.created_at,
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('breed-nfts: unexpected error', err)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
