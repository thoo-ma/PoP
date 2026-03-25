import { serve } from "std/http/server"
import type { NFTRarity as Rarity, NFTType } from '../../../shared/nft.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { randomType, randomName, rollStat, buildImageUrl } from '../_shared/nftHelpers.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'

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

    const cfg = await getGameConfig(supabase)

    console.log(`open-mystery-box: user ${userId}`)

    // ── Request body ─────────────────────────────────────────────────────────
    const body = await req.json()
    const { box_id } = body

    if (!box_id) {
      return respondError(400, 'Bad Request', 'box_id is required')
    }

    // ── Fetch & ownership check ──────────────────────────────────────────────
    const { data: box, error: fetchError } = await supabase
      .from('mystery_boxes')
      .select('id, rarity, opened, user_id')
      .eq('id', box_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !box) {
      return respondError(404, 'Not Found', 'Mystery box not found or not owned by you')
    }

    if (box.opened) {
      return respondError(409, 'Conflict', 'This mystery box has already been opened')
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
      efficiency: rollStat(rarity, cfg.minting),
      resilience: rollStat(rarity, cfg.minting),
      comfort:    rollStat(rarity, cfg.minting),
      luck:       rollStat(rarity, cfg.minting),
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
      return respondError(500, 'Internal server error', insertError.message)
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

    return respondOk(result)

  } catch (err) {
    console.error('open-mystery-box: unexpected error', err)
    return respondError(500, 'Internal server error',
      err instanceof Error ? err.message : 'Unknown error',
    )
  }
})
