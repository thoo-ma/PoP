import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { requireAuth, corsHeaders } from '../_shared/auth.ts'

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
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const auth = await requireAuth(req, 'hold-loot-roll')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    const body = await req.json()
    const { loot_roll_id } = body

    if (!loot_roll_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'loot_roll_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the row and verify ownership
    const { data: roll, error: fetchError } = await supabase
      .from('pending_loot_rolls')
      .select('id, holds')
      .eq('id', loot_roll_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !roll) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'Loot roll not found or not owned by you' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (roll.holds >= 3) {
      return new Response(
        JSON.stringify({ error: 'Max Holds Reached', message: 'You can only hold up to 3 times' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const newHolds = roll.holds + 1

    const { error: updateError } = await supabase
      .from('pending_loot_rolls')
      .update({ holds: newHolds })
      .eq('id', loot_roll_id)
      .eq('user_id', userId)

    if (updateError) {
      console.error('hold-loot-roll: update error', updateError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`hold-loot-roll: user=${userId} roll=${loot_roll_id} holds=${newHolds}`)

    return new Response(
      JSON.stringify({ holds: newHolds }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('hold-loot-roll: unexpected error', err)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
