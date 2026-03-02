import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import type { NFTRarity as Rarity, NFTType } from '../../../shared/nft.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { randomType, randomName, rollStat, buildImageUrl } from '../_shared/nftHelpers.ts'

// ─── Edge Function entry point ─────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const auth = await requireAuth(req, 'open-mystery-box')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    console.log(`open-mystery-box: user ${userId}`)

    // ── Request body ─────────────────────────────────────────────────────────
    const body = await req.json()
    const { box_id } = body

    if (!box_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'box_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch & ownership check ──────────────────────────────────────────────
    const { data: box, error: fetchError } = await supabase
      .from('mystery_boxes')
      .select('id, rarity, opened, user_id')
      .eq('id', box_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !box) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'Mystery box not found or not owned by you' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (box.opened) {
      return new Response(
        JSON.stringify({ error: 'Conflict', message: 'This mystery box has already been opened' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Roll the new NFT ─────────────────────────────────────────────────────
    const rarity = box.rarity as Rarity
    const type   = randomType()
    const name   = randomName(type)

    const newNFT = {
      user_id:    userId,
      name,
      type,
      rarity,
      image_url:  buildImageUrl(type, name, rarity),
      efficiency: rollStat(rarity),
      resilience: rollStat(rarity),
      comfort:    rollStat(rarity),
      luck:       rollStat(rarity),
      energy:     100,
      level:      1,
      xp:         0,
    }

    console.log(`open-mystery-box: minting ${rarity} ${type} "${name}" for user ${userId}`)

    // ── Insert new NFT ───────────────────────────────────────────────────────
    const { data: created, error: insertError } = await supabase
      .from('nfts')
      .insert(newNFT)
      .select()
      .single()

    if (insertError) {
      console.error('open-mystery-box: insert error', insertError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Mark box as opened ───────────────────────────────────────────────────
    const { error: updateError } = await supabase
      .from('mystery_boxes')
      .update({ opened: true })
      .eq('id', box_id)

    if (updateError) {
      console.error('open-mystery-box: update box error', updateError)
      // NFT was already created — log but don't fail the request
    }

    // ── Return the new NFT ───────────────────────────────────────────────────
    const result = {
      id:         created.id,
      name:       created.name,
      image_url:  created.image_url,
      type:       created.type,
      rarity:     created.rarity,
      efficiency: created.efficiency,
      resilience: created.resilience,
      comfort:    created.comfort,
      luck:       created.luck,
      energy:     created.energy,
      level:      created.level,
      xp:         created.xp,
      created_at: created.created_at,
      updated_at: created.updated_at,
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('open-mystery-box: unexpected error', err)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
