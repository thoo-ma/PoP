import type { NFTType, NFTRarity } from '../../../shared/src/nft.ts'
import {
  isOnCooldown,
  getCooldownEndsAt,
  cooldownRemainingSeconds,
} from '../../../shared/src/cooldown.ts'
import { applyXP, XP_PER_USE } from '../../../shared/src/xp.ts'
import { calcPoopEarned } from '../../../shared/src/currency.ts'
import { STAT_POINTS_BY_RARITY } from '../../../shared/src/statPoints.ts'
import {
  TYPE_DRAIN_MULT as DEFAULT_TYPE_DRAIN_MULT,
  ENERGY_ROLL_MIN as DEFAULT_ENERGY_ROLL_MIN,
  ENERGY_ROLL_MAX as DEFAULT_ENERGY_ROLL_MAX,
} from '../../../shared/src/energyDrain.ts'
import { initHandler } from '../_shared/handlerInit.ts'
import { fetchOwned } from '../_shared/fetchOwned.ts'
import { respondOk, respondError, type Warning } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const UseNFTSchema = z.object({
  nft_id: z.string().uuid('nft_id must be a valid UUID'),
})

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
export function calcEnergyLoss(
  resilience: number,
  type: NFTType,
  currentEnergy: number,
  cfg?: { TYPE_DRAIN_MULT: Record<NFTType, number>; ENERGY_ROLL_MIN: number; ENERGY_ROLL_MAX: number },
): number {
  const ENERGY_ROLL_MIN = cfg?.ENERGY_ROLL_MIN ?? DEFAULT_ENERGY_ROLL_MIN
  const ENERGY_ROLL_MAX = cfg?.ENERGY_ROLL_MAX ?? DEFAULT_ENERGY_ROLL_MAX
  const TYPE_DRAIN_MULT = cfg?.TYPE_DRAIN_MULT ?? DEFAULT_TYPE_DRAIN_MULT
  const baseRoll = ENERGY_ROLL_MIN + Math.random() * (ENERGY_ROLL_MAX - ENERGY_ROLL_MIN) // [min, max)
  const resilienceFactor = 1 - resilience / 100
  const mult = TYPE_DRAIN_MULT[type] ?? 1
  const raw = baseRoll * resilienceFactor * mult
  return Math.min(currentEnergy, Math.round(raw))
}

// ─── Edge Function entry point ────────────────────────────────────────────────

export async function handleUseNft(req: Request): Promise<Response> {
  const init = await initHandler(req, 'use-nft')
  if (init instanceof Response) return init
  const { origin, userId, supabase } = init

  try {
    console.log(`use-nft: user ${userId}`)

    // ── Request body ──────────────────────────────────────────────────────────
    const bodyResult = await parseBody(req, UseNFTSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { nft_id } = bodyResult

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const nft = await fetchOwned<{ id: string; type: NFTType; rarity: NFTRarity | null; resilience: number; energy: number; level: number; xp: number; stat_points: number | null; last_used_at: string | null }>(supabase, 'nfts', nft_id, userId, 'id, type, rarity, resilience, energy, level, xp, stat_points, last_used_at', origin)
    if (nft instanceof Response) return nft

    if (nft.energy <= 0) {
      return respondError(422, 'no_energy', 'NFT has no energy remaining', undefined, origin)
    }

    // ── Cooldown check ────────────────────────────────────────────────────────
    if (isOnCooldown(nft.last_used_at, nft.type, nft.level)) {
      const endsAt    = getCooldownEndsAt(nft.last_used_at, nft.type, nft.level)!
      const remaining = cooldownRemainingSeconds(nft.last_used_at, nft.type, nft.level)
      console.log(`use-nft: nft=${nft_id} on cooldown until ${endsAt.toISOString()} (${remaining}s remaining)`)
      return respondError(429, 'on_cooldown',
        `This NFT is on cooldown. Try again in ${Math.ceil(remaining / 60)} minute(s).`,
        {
          cooldown_ends_at:           endsAt.toISOString(),
          cooldown_remaining_seconds: remaining,
        }, origin,
      )
    }

    // ── Energy calculation ────────────────────────────────────────────────────
    const energyLost = calcEnergyLoss(nft.resilience, nft.type, nft.energy)
    const newEnergy = nft.energy - energyLost

    // ── Rarity (used by both POOP reward and stat points) ────────────────────
    const rarity: NFTRarity = nft.rarity ?? 'common'

    // ── POOP reward calculation ────────────────────────────────────────────────
    const poopEarned = calcPoopEarned(nft.type, rarity, nft.level)

    // ── XP calculation ───────────────────────────────────────────────────────
    const xpGained = XP_PER_USE
    const { newXP, newLevel, leveledUp, levelsGained } = applyXP(nft.xp, nft.level, xpGained)

    // ── Stat points earned ───────────────────────────────────────────────────
    const statPointsEarned = levelsGained * (STAT_POINTS_BY_RARITY[rarity] ?? 0)
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
      return respondError(500, 'internal_error', updateError.message, undefined, origin)
    }

    // ── Award POOP currency ───────────────────────────────────────────────────
    const warnings: Warning[] = []

    const { data: poopData, error: poopError } = await supabase.rpc(
      'increment_poop_balance',
      { user_id: userId, amount: poopEarned },
    )

    if (poopError) {
      // Non-fatal: log but don't fail the whole request
      console.error('use-nft: poop increment error', poopError)
      warnings.push({ code: 'poop_reward_failed', detail: poopError.message })
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
      warnings.push({ code: 'loot_roll_failed', detail: lootRollError.message })
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
      ...(warnings.length ? { warnings } : {}),
    }, origin)

  } catch (err) {
    console.error('use-nft: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
      undefined, origin,
    )
  }
}
