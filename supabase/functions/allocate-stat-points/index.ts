import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { requireAuth, corsHeaders } from '../_shared/auth.ts'

// ─── Edge Function entry point ────────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = await requireAuth(req, 'allocate-stat-points')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    // ── Request body ──────────────────────────────────────────────────────────
    const body = await req.json()
    const { nft_id, efficiency = 0, resilience = 0, comfort = 0, luck = 0 } = body

    if (!nft_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'nft_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic type validation – all deltas must be non-negative integers
    for (const [key, val] of Object.entries({ efficiency, resilience, comfort, luck })) {
      if (!Number.isInteger(val) || val < 0) {
        return new Response(
          JSON.stringify({ error: 'Bad Request', message: `${key} must be a non-negative integer` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const totalSpend = efficiency + resilience + comfort + luck

    if (totalSpend === 0) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'At least one point must be allocated' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchError } = await supabase
      .from('nfts')
      .select('id, efficiency, resilience, comfort, luck, stat_points')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !nft) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'NFT not found or not owned by you' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Validation ────────────────────────────────────────────────────────────
    if (totalSpend > nft.stat_points) {
      return new Response(
        JSON.stringify({
          error:   'Insufficient Points',
          message: `You only have ${nft.stat_points} stat point(s) but tried to spend ${totalSpend}`,
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Each stat is capped at 100
    const newEfficiency = nft.efficiency + efficiency
    const newResilience = nft.resilience + resilience
    const newComfort    = nft.comfort    + comfort
    const newLuck       = nft.luck       + luck

    if (newEfficiency > 100 || newResilience > 100 || newComfort > 100 || newLuck > 100) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'A stat cannot exceed 100' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('nfts')
      .update({
        efficiency:  newEfficiency,
        resilience:  newResilience,
        comfort:     newComfort,
        luck:        newLuck,
        stat_points: nft.stat_points - totalSpend,
      })
      .eq('id', nft_id)
      .eq('user_id', userId)   // defence-in-depth ownership check
      .select('id, efficiency, resilience, comfort, luck, stat_points')
      .single()

    if (updateError) {
      console.error('allocate-stat-points: update error', updateError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(
      `allocate-stat-points: nft=${nft_id} spent=${totalSpend} ` +
      `eff ${nft.efficiency}→${updated.efficiency} ` +
      `res ${nft.resilience}→${updated.resilience} ` +
      `com ${nft.comfort}→${updated.comfort} ` +
      `luck ${nft.luck}→${updated.luck} ` +
      `pts_remaining=${updated.stat_points}`
    )

    // ── Return result ─────────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        id:          updated.id,
        efficiency:  updated.efficiency,
        resilience:  updated.resilience,
        comfort:     updated.comfort,
        luck:        updated.luck,
        stat_points: updated.stat_points,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('allocate-stat-points: unexpected error', err)
    return new Response(
      JSON.stringify({
        error:   'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
