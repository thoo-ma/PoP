import { BASE_WIN_PROBABILITY, PER_HOLD_INCREMENT } from '../../../shared/lootRoll.ts'
import { initHandler } from '../_shared/handlerInit.ts'
import { fetchOwned } from '../_shared/fetchOwned.ts'
import { buildMysteryBoxImageUrl } from '../_shared/nftHelpers.ts'
import { respondOk, respondError, type Warning } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const RollLootSchema = z.object({
  loot_roll_id: z.string().uuid('loot_roll_id must be a valid UUID'),
})

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
export async function handleRollLoot(req: Request): Promise<Response> {
  const init = await initHandler(req, 'roll-loot')
  if (init instanceof Response) return init
  const { origin, userId, supabase } = init

  try {
    const bodyResult = await parseBody(req, RollLootSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { loot_roll_id } = bodyResult

    // Fetch and verify ownership
    const roll = await fetchOwned<{ id: string; holds: number }>(supabase, 'pending_loot_rolls', loot_roll_id, userId, 'id, holds', origin)
    if (roll instanceof Response) return roll

    const holdsUsed = roll.holds

    // Delete the pending row regardless of outcome
    const warnings: Warning[] = []

    const { error: deleteError } = await supabase
      .from('pending_loot_rolls')
      .delete()
      .eq('id', loot_roll_id)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('roll-loot: delete error', deleteError)
      // Non-fatal; proceed with the roll
      warnings.push({ code: 'pending_roll_cleanup_failed', detail: deleteError.message })
    }

    // ── Server-side roll ──────────────────────────────────────────────────────
    // Probability = BASE_WIN_PROBABILITY + holds × PER_HOLD_INCREMENT
    const probability = BASE_WIN_PROBABILITY + holdsUsed * PER_HOLD_INCREMENT
    const won = Math.random() < probability

    console.log(
      `roll-loot: user=${userId} holds=${holdsUsed} probability=${(probability * 100).toFixed(0)}% won=${won}`
    )

    if (!won) {
      return respondOk({ won: false, holds_used: holdsUsed, ...(warnings.length ? { warnings } : {}) }, origin)
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
      return respondError(500, 'internal_error', boxError?.message ?? 'Failed to award mystery box', undefined, origin)
    }

    console.log(`roll-loot: awarded mystery box id=${box.id} rarity=${rarity} to user=${userId}`)

    return respondOk({ won: true, holds_used: holdsUsed, box: { id: box.id, rarity: box.rarity }, ...(warnings.length ? { warnings } : {}) }, origin)

  } catch (err) {
    console.error('roll-loot: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
      undefined, origin,
    )
  }
}
