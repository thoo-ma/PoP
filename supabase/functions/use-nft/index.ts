import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import type { NFTType, NFTRarity } from '../../../shared/nft.ts'
import {
  isOnCooldown,
  getCooldownEndsAt,
  cooldownRemainingSeconds,
} from '../../../shared/cooldown.ts'
import { applyXP } from '../../../shared/xp.ts'
import { calcPoopEarned } from '../../../shared/currency.ts'
import { requireAuth, corsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'

/**
 * Calculate energy lost for a single use.
 *
 * loss = random(ROLL_MIN..ROLL_MAX) * (1 - resilience / 100) * mult
 *
 * - Base roll: uniform [ENERGY_ROLL_MIN, ENERGY_ROLL_MAX] from config.
 * - Resilience dampener: higher resilience = smaller loss.
 * - Type multiplier: turbo-flush drains fast, zen-fortress is efficient.
 *
 * Result is clamped to [0, current_energy] and rounded to the nearest integer.
 */
function calcEnergyLoss(
  resilience: number,
  type: NFTType,
  currentEnergy: number,
  cfg: { TYPE_DRAIN_MULT: Record<NFTType, number>; ENERGY_ROLL_MIN: number; ENERGY_ROLL_MAX: number },
): number {
  const { ENERGY_ROLL_MIN, ENERGY_ROLL_MAX, TYPE_DRAIN_MULT } = cfg
  const baseRoll = ENERGY_ROLL_MIN + Math.random() * (ENERGY_ROLL_MAX - ENERGY_ROLL_MIN) // [min, max)
  const resilienceFactor = 1 - resilience / 100
  const mult = TYPE_DRAIN_MULT[type] ?? 1
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
    const auth = await requireAuth(req, 'use-nft')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    // ── Load live game config (falls back to shared/ defaults) ────────────────
    const cfg = await getGameConfig(supabase)

    console.log(`use-nft: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const body = await req.json()
    const { nft_id } = body

    if (!nft_id) {
      return respondError(400, 'Bad Request', 'nft_id is required')
    }

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchError } = await supabase
      .from('nfts')
      .select('id, type, rarity, resilience, energy, level, xp, stat_points, last_used_at')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !nft) {
      return respondError(404, 'Not Found', 'NFT not found or not owned by you')
    }

    if (nft.energy <= 0) {
      return respondError(422, 'No Energy', 'NFT has no energy remaining')
    }

    // ── Cooldown check ────────────────────────────────────────────────────────
    if (isOnCooldown(nft.last_used_at, nft.type as NFTType, nft.level, cfg.cooldown)) {
      const endsAt    = getCooldownEndsAt(nft.last_used_at, nft.type as NFTType, nft.level, cfg.cooldown)!
      const remaining = cooldownRemainingSeconds(nft.last_used_at, nft.type as NFTType, nft.level, cfg.cooldown)
      console.log(`use-nft: nft=${nft_id} on cooldown until ${endsAt.toISOString()} (${remaining}s remaining)`)
      return respondError(429, 'on_cooldown',
        `This NFT is on cooldown. Try again in ${Math.ceil(remaining / 60)} minute(s).`,
        {
          cooldown_ends_at:           endsAt.toISOString(),
          cooldown_remaining_seconds: remaining,
        },
      )
    }

    // ── Energy calculation ────────────────────────────────────────────────────
    const energyLost = calcEnergyLoss(nft.resilience, nft.type as NFTType, nft.energy, cfg.energy_drain)
    const newEnergy = nft.energy - energyLost

    // ── Rarity (used by both POOP reward and stat points) ────────────────────
    const rarity = (nft.rarity ?? 'common') as NFTRarity

    // ── POOP reward calculation ────────────────────────────────────────────────
    const poopEarned = calcPoopEarned(nft.type as NFTType, rarity, nft.level, cfg.currency)

    // ── XP calculation ───────────────────────────────────────────────────────
    const xpGained = cfg.xp.XP_PER_USE
    const { newXP, newLevel, leveledUp, levelsGained } = applyXP(nft.xp, nft.level, xpGained, cfg.xp)

    // ── Stat points earned ───────────────────────────────────────────────────
    const statPointsEarned = levelsGained * (cfg.stat_points.STAT_POINTS_BY_RARITY[rarity] ?? 0)
    const newStatPoints = (nft.stat_points ?? 0) + statPointsEarned

    console.log(
      `use-nft: nft=${nft_id} type=${nft.type} rarity=${rarity} resilience=${nft.resilience} ` +
      `energy ${nft.energy} → ${newEnergy} (lost ${energyLost}) | ` +
      `xp ${nft.xp}+${xpGained} → ${newXP} level ${nft.level} → ${newLevel} | ` +
      `stat_points +${statPointsEarned} → ${newStatPoints}`
    )

    // ── Persist ───────────────────────────────────────────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('nfts')
      .update({
        energy:      newEnergy,
        xp:          newXP,
        level:       newLevel,
        stat_points: newStatPoints,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', nft_id)
      .eq('user_id', userId)   // defence-in-depth ownership check
      .select('id, energy, xp, level, stat_points')
      .single()

    if (updateError) {
      console.error('use-nft: update error', updateError)
      return respondError(500, 'Internal server error', updateError.message)
    }

    // ── Award POOP currency ───────────────────────────────────────────────────
    const { data: poopData, error: poopError } = await supabase.rpc(
      'increment_poop_balance',
      { user_id: userId, amount: poopEarned },
    )

    if (poopError) {
      // Non-fatal: log but don't fail the whole request
      console.error('use-nft: poop increment error', poopError)
    }

    const newPoopBalance: number = (poopData as number) ?? 0

    console.log(`use-nft: user ${userId} earned ${poopEarned} POOP (type=${nft.type} rarity=${rarity} level=${nft.level}) → balance ${newPoopBalance}`)

    // ── Create pending loot roll ──────────────────────────────────────────────
    // Upsert one row per user; any stale un-rolled session is silently replaced.
    const { data: lootRollData, error: lootRollError } = await supabase
      .from('pending_loot_rolls')
      .upsert(
        { user_id: userId, nft_id: nft_id, holds: 0 },
        { onConflict: 'user_id' }
      )
      .select('id')
      .single()

    if (lootRollError) {
      // Non-fatal: log but don't fail the whole request
      console.error('use-nft: loot roll upsert error', lootRollError)
    }

    const lootRollId: string | null = lootRollData?.id ?? null
    console.log(`use-nft: loot roll upserted → id=${lootRollId}`)

    // ── Return result ─────────────────────────────────────────────────────────
    return respondOk({
      id:           updated.id,
      energy:       updated.energy,
      energy_lost:  energyLost,
      depleted:     updated.energy === 0,
      xp:           updated.xp,
      xp_gained:    xpGained,
      level:        updated.level,
      leveled_up:   leveledUp,
      stat_points:  updated.stat_points,
      poop_earned:  poopEarned,
      poop_balance: newPoopBalance,
      loot_roll_id: lootRollId,
    })

  } catch (err) {
    console.error('use-nft: unexpected error', err)
    return respondError(500, 'Internal server error',
      err instanceof Error ? err.message : 'Unknown error',
    )
  }
})
