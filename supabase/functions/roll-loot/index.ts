import { serve } from "std/http/server"
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { buildMysteryBoxImageUrl } from '../_shared/nftHelpers.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'

/**
 * roll-loot
 *
 * Performs the server-side loot roll for the caller's pending loot roll.
 * The pending row is deleted regardless of outcome (win or loss).
 *
 * Loot probability:
 *   base = 10%
 *   per hold = +10%
 *   max (3 holds) = 40%
 *
 * On win: inserts a common mystery box for the user.
 *
 * Request body: { loot_roll_id: string }
 * Response:
 *   { won: false, holds_used: number }
 *   { won: true,  holds_used: number, box: { id: string, rarity: 'common' } }
 *
 * Errors:
 *   400  loot_roll_id missing
 *   404  roll not found / not owned by caller
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const auth = await requireAuth(req, 'roll-loot')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    const cfg = await getGameConfig(supabase)

    const body = await req.json()
    const { loot_roll_id } = body

    if (!loot_roll_id) {
      return respondError(400, 'Bad Request', 'loot_roll_id is required')
    }

    // Fetch and verify ownership
    const { data: roll, error: fetchError } = await supabase
      .from('pending_loot_rolls')
      .select('id, holds')
      .eq('id', loot_roll_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !roll) {
      return respondError(404, 'Not Found', 'Loot roll not found or not owned by you')
    }

    const holdsUsed = roll.holds

    // Delete the pending row regardless of outcome
    const { error: deleteError } = await supabase
      .from('pending_loot_rolls')
      .delete()
      .eq('id', loot_roll_id)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('roll-loot: delete error', deleteError)
      // Non-fatal; proceed with the roll
    }

    // ── Server-side roll ──────────────────────────────────────────────────────
    // Probability = BASE_WIN_PROBABILITY + holds × PER_HOLD_INCREMENT
    const { BASE_WIN_PROBABILITY, PER_HOLD_INCREMENT } = cfg.loot_roll
    const probability = BASE_WIN_PROBABILITY + holdsUsed * PER_HOLD_INCREMENT
    const won = Math.random() < probability

    console.log(
      `roll-loot: user=${userId} holds=${holdsUsed} probability=${(probability * 100).toFixed(0)}% won=${won}`
    )

    if (!won) {
      return respondOk({ won: false, holds_used: holdsUsed })
    }

    // ── Award mystery box ─────────────────────────────────────────────────────
    const rarity = 'common'
    const imageUrl = buildMysteryBoxImageUrl(rarity)

    const { data: box, error: boxError } = await supabase
      .from('mystery_boxes')
      .insert({ user_id: userId, rarity, image_url: imageUrl })
      .select('id, rarity')
      .single()

    if (boxError || !box) {
      console.error('roll-loot: mystery box insert error', boxError)
      return respondError(500, 'Internal server error', boxError?.message ?? 'Failed to award mystery box')
    }

    console.log(`roll-loot: awarded mystery box id=${box.id} rarity=${rarity} to user=${userId}`)

    return respondOk({ won: true, holds_used: holdsUsed, box: { id: box.id, rarity: box.rarity } })

  } catch (err) {
    console.error('roll-loot: unexpected error', err)
    return respondError(500, 'Internal server error',
      err instanceof Error ? err.message : 'Unknown error',
    )
  }
})
