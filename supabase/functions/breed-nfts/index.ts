import { serve } from "std/http/server"
import { RARITY_RANK, type NFTRarity as Rarity } from '../../../shared/nft.ts'
import type { Tables } from '../../../shared/database.types.ts'
import { buildMysteryBoxImageUrl } from '../_shared/nftHelpers.ts'
import type { BreedPairKey } from '../../../shared/breedProbabilities.ts'
import { breedCost } from '../../../shared/currency.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'
import { parseDegenPercent, applyDegenBar, computeConfigHash } from '../_shared/degenBar.ts'

const BreedSchema = z.object({
  parent1_id:    z.string().uuid('parent1_id must be a valid UUID'),
  parent2_id:    z.string().uuid('parent2_id must be a valid UUID'),
  degen_percent: z.number().int().min(0).max(100).default(0).optional(),
}).refine((d) => d.parent1_id !== d.parent2_id, {
  message: 'Cannot breed an NFT with itself',
  path: ['parent2_id'],
})

// ─── Rarity system ───────────────────────────────────────────────────────────

function rarityKey(r1: Rarity, r2: Rarity): BreedPairKey {
  // Sort so that the lower-rank rarity always comes first
  return [r1, r2]
    .sort((a, b) => RARITY_RANK[a] - RARITY_RANK[b])
    .join('+') as BreedPairKey
}

function rollRarity(r1: Rarity, r2: Rarity, probsMap: Record<BreedPairKey, [number, number, number, number]>): Rarity {
  const key = rarityKey(r1, r2)
  const probs = probsMap[key]
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

    // ── Load live game config ─────────────────────────────────────────────────
    const cfg = await getGameConfig(supabase)

    console.log(`breed-nfts: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const bodyResult = await parseBody(req, BreedSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { parent1_id, parent2_id } = bodyResult

    // ── Degen percent ─────────────────────────────────────────────────────────
    let degenPercent: number
    try {
      degenPercent = parseDegenPercent(bodyResult)
    } catch {
      return respondError(400, 'bad_request', 'degen_percent must be an integer between 0 and 100')
    }

    // ── Fetch & ownership check ───────────────────────────────────────────────
    const { data: parents, error: fetchError } = await supabase
      .from('nfts')
      .select('*')
      .in('id', [parent1_id, parent2_id])
      .eq('user_id', userId)

    if (fetchError) {
      console.error('breed-nfts: fetch parents error', fetchError)
      return respondError(500, 'internal_error', fetchError.message)
    }

    if (!parents || parents.length !== 2) {
      return respondError(404, 'not_found', 'One or both NFTs not found or not owned by you')
    }

    const p1 = parents.find((p: Tables<'nfts'>) => p.id === parent1_id)!
    const p2 = parents.find((p: Tables<'nfts'>) => p.id === parent2_id)!

    // ── Rarity adjacency check ────────────────────────────────────────────────
    const r1 = p1.rarity as Rarity
    const r2 = p2.rarity as Rarity
    const rankDiff = Math.abs(RARITY_RANK[r1] - RARITY_RANK[r2])

    if (rankDiff > 1) {
      return respondError(422, 'incompatible_rarities',
        `Cannot breed ${r1} with ${r2}. Only NFTs of the same or adjacent rarity can be bred together.`,
      )
    }

    // ── Breed count cap check ─────────────────────────────────────────────────
    const p1BreedCount = p1.breed_count ?? 0
    const p2BreedCount = p2.breed_count ?? 0
    const BREED_MAX_COUNT = cfg.currency.BREED_MAX_COUNT

    if (p1BreedCount >= BREED_MAX_COUNT || p2BreedCount >= BREED_MAX_COUNT) {
      const exhausted = p1BreedCount >= BREED_MAX_COUNT ? parent1_id : parent2_id
      return respondError(422, 'breed_limit_reached',
        `NFT ${exhausted} has already been bred ${BREED_MAX_COUNT} times and can no longer be used as a parent.`,
        { exhausted_nft_id: exhausted },
      )
    }

    // ── Dynamic breed cost ────────────────────────────────────────────────────
    // Each parent is charged independently based on its own breed_count and
    // rarity; the session total is the sum of both individual costs.
    const p1Cost = breedCost(p1BreedCount, r1, cfg.currency)
    const p2Cost = breedCost(p2BreedCount, r2, cfg.currency)
    const totalBreedCost = p1Cost + p2Cost

    console.log(
      `breed-nfts: cost breakdown — ` +
      `parent1 (${r1} breed_count=${p1BreedCount}) → ${p1Cost} POOP, ` +
      `parent2 (${r2} breed_count=${p2BreedCount}) → ${p2Cost} POOP, ` +
      `total → ${totalBreedCost} POOP`
    )

    // ── Apply degen bar + POOP decrement ─────────────────────────────────────
    console.log(`breed-nfts: degen — percent=${degenPercent}`)
    let chargedAmount: number
    let newBalance: number | null
    let outcome: { busted: boolean }
    try {
      const result = await applyDegenBar(supabase, userId, totalBreedCost, degenPercent, 'breed', cfg.degen_bar)
      chargedAmount = result.chargedAmount
      newBalance    = result.newBalance
      outcome       = result.outcome
    } catch (degenErr) {
      console.error('breed-nfts: applyDegenBar error', degenErr)
      return respondError(500, 'internal_error',
        degenErr instanceof Error ? degenErr.message : 'Unknown error',
      )
    }

    console.log(`breed-nfts: degen — percent=${degenPercent}, busted=${outcome.busted}, charged=${chargedAmount}`)

    if (newBalance === null) {
      const { data: wallet } = await supabase.from('users').select('poop_balance').eq('id', userId).single()
      const currentBalance = wallet?.poop_balance ?? 0
      return respondError(402, 'insufficient_poop',
        `Breeding costs ${chargedAmount} POOP (${p1Cost} + ${p2Cost}). You have ${currentBalance} POOP.`,
        {
          poop_balance: currentBalance,
          poop_required: chargedAmount,
          poop_required_breakdown: { parent1: p1Cost, parent2: p2Cost },
        },
      )
    }

    // ── Bust: charge full price, skip offspring creation ──────────────────────
    if (outcome.busted) {
      return respondError(422, 'busted', 'busted', {
        degen_percent: degenPercent,
        poop_spent:    chargedAmount,
        poop_balance:  newBalance,
        config_hash:   computeConfigHash(cfg.degen_bar),
      })
    }

    // ── Rarity roll ───────────────────────────────────────────────────────────
    const offspringRarity = rollRarity(r1, r2, cfg.breed.BREED_PROBABILITIES)

    console.log(`breed-nfts: ${r1}+${r2} → mystery box (${offspringRarity}) (key: ${rarityKey(r1, r2)})`)

    // ── Build mystery box ─────────────────────────────────────────────────────
    const mysteryBox = {
      user_id:   userId,
      rarity:    offspringRarity,
      image_url: buildMysteryBoxImageUrl(offspringRarity),
      opened:    false,
    }

    // ── Insert ────────────────────────────────────────────────────────────────
    const { data: created, error: insertError } = await supabase
      .from('mystery_boxes')
      .insert(mysteryBox)
      .select()
      .single()

    if (insertError) {
      console.error('breed-nfts: insert error', insertError)
      return respondError(500, 'internal_error', insertError.message)
    }

    console.log(`breed-nfts: user ${userId} spent ${chargedAmount} POOP (${p1Cost}+${p2Cost}) → balance ${newBalance}`)

    // ── Increment breed_count for both parents ────────────────────────────────
    const { error: breedCountError } = await supabase
      .from('nfts')
      .update({ breed_count: p1BreedCount + 1 })
      .eq('id', parent1_id)
      .eq('user_id', userId)

    if (breedCountError) {
      console.error('breed-nfts: breed_count increment error (parent1)', breedCountError)
    }

    const { error: breedCountError2 } = await supabase
      .from('nfts')
      .update({ breed_count: p2BreedCount + 1 })
      .eq('id', parent2_id)
      .eq('user_id', userId)

    if (breedCountError2) {
      console.error('breed-nfts: breed_count increment error (parent2)', breedCountError2)
    }

    console.log(`breed-nfts: breed_count incremented — parent1=${p1BreedCount + 1} parent2=${p2BreedCount + 1}`)

    // ── Return new mystery box ────────────────────────────────────────────────
    const result = {
      id:           created.id,
      rarity:       created.rarity,
      image_url:    created.image_url,
      opened:       created.opened,
      created_at:   created.created_at,
      poop_spent:   chargedAmount,
      poop_spent_breakdown: { parent1: p1Cost, parent2: p2Cost },
      poop_balance: newBalance,
      degen_percent: degenPercent,
      original_cost: totalBreedCost,
      reduced_cost:  chargedAmount,
      config_hash:   computeConfigHash(cfg.degen_bar),
    }

    return respondOk(result)

  } catch (err) {
    console.error('breed-nfts: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
    )
  }
})
