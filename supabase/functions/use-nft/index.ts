import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Tier multipliers ─────────────────────────────────────────────────────────
// Higher multiplier = faster energy drain when used

type NFTTier = 'cruise-seat' | 'turbo-flush' | 'zen-fortress'

const TIER_DRAIN_MULT: Record<NFTTier, number> = {
  'turbo-flush':  3,
  'cruise-seat':  1.5,
  'zen-fortress': 1,
}

/**
 * Calculate energy lost for a single use.
 *
 * loss = random(5..15) * (1 - resilience / 100) * mult
 *
 * - Base roll: uniform [5, 15] so a fresh NFT always loses some energy.
 * - Resilience dampener: higher resilience = smaller loss (0 res → ×1.0, 100 res → ×0.0).
 * - Tier multiplier: turbo-flush drains fast, zen-fortress is efficient.
 *
 * Result is clamped to [0, current_energy] and rounded to the nearest integer.
 */
function calcEnergyLoss(resilience: number, tier: NFTTier, currentEnergy: number): number {
  const baseRoll = 5 + Math.random() * 10          // [5, 15)
  const resilienceFactor = 1 - resilience / 100     // [0, 1]
  const mult = TIER_DRAIN_MULT[tier] ?? 1

  const raw = baseRoll * resilienceFactor * mult
  return Math.min(currentEnergy, Math.round(raw))
}

// ─── Edge Function entry point ────────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // ── Extract user ID ───────────────────────────────────────────────────────
    let userId: string | null = null

    try {
      const { data, error: userError } = await supabase.auth.getUser(token)
      if (userError) console.error('use-nft: getUser error', userError)
      if (data?.user?.id) userId = data.user.id
    } catch (e) {
      console.error('use-nft: getUser exception', e)
    }

    if (!userId) {
      // Fallback: decode JWT payload without a network call
      try {
        const b64url = token.split('.')[1]
        const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
        const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')
        const payload = JSON.parse(atob(padded))
        if (payload?.sub) userId = payload.sub
      } catch (e) {
        console.error('use-nft: JWT decode failed', e)
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Could not extract user from token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`use-nft: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const body = await req.json()
    const { nft_id } = body

    if (!nft_id) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'nft_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchError } = await supabase
      .from('nfts')
      .select('id, tier, resilience, energy')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !nft) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'NFT not found or not owned by you' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (nft.energy <= 0) {
      return new Response(
        JSON.stringify({ error: 'No Energy', message: 'NFT has no energy remaining' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Energy calculation ────────────────────────────────────────────────────
    const energyLost = calcEnergyLoss(nft.resilience, nft.tier as NFTTier, nft.energy)
    const newEnergy = nft.energy - energyLost

    console.log(
      `use-nft: nft=${nft_id} tier=${nft.tier} resilience=${nft.resilience} ` +
      `energy ${nft.energy} → ${newEnergy} (lost ${energyLost})`
    )

    // ── Persist ───────────────────────────────────────────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('nfts')
      .update({ energy: newEnergy })
      .eq('id', nft_id)
      .eq('user_id', userId)   // defence-in-depth ownership check
      .select('id, energy')
      .single()

    if (updateError) {
      console.error('use-nft: update error', updateError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Return result ─────────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        id:           updated.id,
        energy:       updated.energy,
        energy_lost:  energyLost,
        depleted:     updated.energy === 0,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('use-nft: unexpected error', err)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
