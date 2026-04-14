import { MAX_HOLDS } from '../../../shared/src/lootRoll.ts'
import { initHandler } from '../_shared/handlerInit.ts'
import { fetchOwned } from '../_shared/fetchOwned.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const HoldLootRollSchema = z.object({
  loot_roll_id: z.string().uuid('loot_roll_id must be a valid UUID'),
})

/**
 * hold-loot-roll
 *
 * Increments the `holds` counter on the caller's pending loot roll by 1.
 * Each hold adds +10% to the base 10% loot chance, up to a maximum of 3 holds.
 *
 * Request body: { loot_roll_id: string }
 * Response:     { holds: number }        — updated holds count (1–3)
 *
 * Errors:
 *   400  loot_roll_id missing
 *   400  already at max holds (3)
 *   404  roll not found / not owned by caller
 */
export async function handleHoldLootRoll(req: Request): Promise<Response> {
  const init = await initHandler(req, 'hold-loot-roll')
  if (init instanceof Response) return init
  const { origin, userId, supabase } = init

  try {

    const bodyResult = await parseBody(req, HoldLootRollSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { loot_roll_id } = bodyResult

    // Fetch the row and verify ownership
    const roll = await fetchOwned<{ id: string; holds: number }>(supabase, 'pending_loot_rolls', loot_roll_id, userId, 'id, holds', origin)
    if (roll instanceof Response) return roll

    if (roll.holds >= MAX_HOLDS) {
      return respondError(422, 'max_holds_reached', `You can only hold up to ${MAX_HOLDS} times`, undefined, origin)
    }

    const newHolds = roll.holds + 1

    const { error: updateError } = await supabase
      .from('pending_loot_rolls')
      .update({ holds: newHolds })
      .eq('id', loot_roll_id)
      .eq('user_id', userId)

    if (updateError) {
      console.error('hold-loot-roll: update error', updateError)
      return respondError(500, 'internal_error', updateError.message, undefined, origin)
    }

    console.log(`hold-loot-roll: user=${userId} roll=${loot_roll_id} holds=${newHolds}`)

    return respondOk({ holds: newHolds }, origin)

  } catch (err) {
    console.error('hold-loot-roll: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
      undefined, origin,
    )
  }
}
