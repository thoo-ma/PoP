import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { RARITY_RANK, TYPE_NAMES, type NFTRarity as Rarity, type NFTType } from '../../../shared/nft.ts'
import { BREED_PROBABILITIES } from '../../../shared/breedProbabilities.ts'
import type { BreedPairKey } from '../../../shared/breedProbabilities.ts'
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
