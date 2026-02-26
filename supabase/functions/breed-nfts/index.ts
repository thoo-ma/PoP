import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { RARITY_RANK, BREED_PROBABILITIES } from '../_shared/breedProbabilities.ts'
import type { NFTRarity as Rarity } from '../_shared/breedProbabilities.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Rarity system ───────────────────────────────────────────────────────────
// RARITY_RANK and BREED_PROBABILITIES are imported from shared/breedProbabilities.ts

type NFTType = 'cruise-seat' | 'turbo-flush' | 'zen-fortress'

function rarityKey(r1: Rarity, r2: Rarity): string {
  // Sort so that the lower-rank rarity always comes first
  return [r1, r2]
    .sort((a, b) => RARITY_RANK[a] - RARITY_RANK[b])
    .join('+')
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

// ─── Type & name system ────────────────────────────────────────────────────────

const TYPE_WEIGHTS: Record<NFTType, number> = {
  'turbo-flush':  1,
  'cruise-seat':  2,
  'zen-fortress': 3,
}

const TYPE_FROM_WEIGHT: Array<[number, NFTType]> = [
  [1.5, 'turbo-flush'],
  [2.5, 'cruise-seat'],
  [Infinity, 'zen-fortress'],
]

const TYPE_NAMES: Record<NFTType, readonly string[]> = {
  'cruise-seat': [
    'ancient-egyptian',
    'ancient-maya-stone',
    'medieval-castle-garderobe',
    'prehistoric-stone',
    'victorian-era-wooden-throne',
  ],
  'turbo-flush': [
    'astronaut-zero-gravity',
    'portable-construction-site-cabin',
    'prehistoric-sanitation',
    'roman-public-latrines',
    'rustic-forest-outhouse',
    'squat',
  ],
  'zen-fortress': [
    'cyberpunk-dystopian',
    'dubai',
    'eco-friendly',
    'futuristic-sci-fi-vacuum',
    'renaissance-chaise',
  ],
}

function resolveOffspringType(t1: NFTType, t2: NFTType): NFTType {
  const avg = (TYPE_WEIGHTS[t1] + TYPE_WEIGHTS[t2]) / 2
  for (const [threshold, type] of TYPE_FROM_WEIGHT) {
    if (avg <= threshold) return type
  }
  return 'zen-fortress'
}

function randomName(type: NFTType): string {
  const names = TYPE_NAMES[type]
  return names[Math.floor(Math.random() * names.length)]
}

function formatDisplayName(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Stat helpers ─────────────────────────────────────────────────────────────

function breedStat(s1: number, s2: number): number {
  const avg = (s1 + s2) / 2
  const noise = (Math.random() - 0.5) * 10 // ±5
  return Math.max(0, Math.min(100, Math.round(avg + noise)))
}

// ─── Image URL ────────────────────────────────────────────────────────────────

const SUPABASE_PROJECT_URL = Deno.env.get('SUPABASE_URL') ?? ''

function buildImageUrl(type: NFTType, name: string, rarity: Rarity): string {
  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/assets/toilets/${type}/${name}/${name}-${rarity}.jpg`
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
    // 1. Try getUser() via the service-role client (same pattern as detect-toilet-flush;
    //    works reliably including Expo Go / dev tunnels).
    // 2. Fall back to manual JWT payload decode (no network call needed).
    let userId: string | null = null

    try {
      const { data, error: userError } = await supabase.auth.getUser(token)
      if (userError) {
        console.error('breed-nfts: getUser error', userError)
      }
      if (data?.user?.id) userId = data.user.id
    } catch (e) {
      console.error('breed-nfts: getUser exception', e)
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
        console.error('breed-nfts: JWT decode failed', e)
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Could not extract user from token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // ── Rarity roll ───────────────────────────────────────────────────────────
    const offspringRarity = rollRarity(r1, r2)

    // ── Type & name ────────────────────────────────────────────────────────────
    const t1 = p1.type as NFTType
    const t2 = p2.type as NFTType
    const offspringType = resolveOffspringType(t1, t2)
    const offspringName = randomName(offspringType)

    // ── Stats ─────────────────────────────────────────────────────────────────
    const offspring = {
      user_id: userId,
      name: offspringName,
      type: offspringType,
      rarity: offspringRarity,
      image_url: buildImageUrl(offspringType, offspringName, offspringRarity),
      efficiency: breedStat(p1.efficiency, p2.efficiency),
      resilience: breedStat(p1.resilience, p2.resilience),
      comfort:    breedStat(p1.comfort,    p2.comfort),
      luck:       breedStat(p1.luck,       p2.luck),
      energy: 100,
      level:  1,
      xp:     0,
    }

    console.log(`breed-nfts: ${r1}+${r2} → ${offspringRarity} (key: ${rarityKey(r1, r2)})`)

    // ── Insert ────────────────────────────────────────────────────────────────
    const { data: created, error: insertError } = await supabase
      .from('nfts')
      .insert(offspring)
      .select()
      .single()

    if (insertError) {
      console.error('breed-nfts: insert error', insertError)
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Return new NFT ────────────────────────────────────────────────────────
    const result = {
      id:         created.id,
      name:       created.name,
      image:      created.image_url,
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
