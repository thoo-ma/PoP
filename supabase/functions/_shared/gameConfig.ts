/**
 * getGameConfig — live game balance config helper for Edge Functions.
 *
 * Reads every row from the `game_config` table (up to 10 rows, one per
 * mechanic key), validates each JSONB blob with its Zod schema, and
 * deep-merges valid overrides over the hard-coded shared/ defaults.
 *
 * Any missing or invalid row falls back silently to its defaults so the
 * game always runs, even when the table is empty or has bad data.
 *
 * Usage:
 *   const cfg = await getGameConfig(supabase)
 *   calcPoopEarned(type, rarity, level, cfg.currency)
 *   applyXP(xp, level, xpGained, cfg.xp)
 */

import { GAME_CONFIG_REGISTRY } from '../../../shared/schemas.ts'
import type {
  CurrencyConfig,
  CooldownConfig,
  XpConfig,
  StatPointsConfig,
  BreedConfig,
  MintingConfig,
  SensorsConfig,
  EnergyDrainConfig,
  LootRollConfig,
  CloudRunConfig,
  GameConfigKey,
} from '../../../shared/schemas.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// deno-lint-ignore no-explicit-any
type SupabaseClient = ReturnType<typeof createClient<any>>

export type FullGameConfig = {
  currency:     CurrencyConfig
  cooldown:     CooldownConfig
  xp:           XpConfig
  stat_points:  StatPointsConfig
  breed:        BreedConfig
  minting:      MintingConfig
  sensors:      SensorsConfig
  energy_drain: EnergyDrainConfig
  loot_roll:    LootRollConfig
  cloud_run:    CloudRunConfig
}

/**
 * Fetch and merge game config from the DB.
 * Always returns a complete FullGameConfig — worst case everything is defaults.
 */
export async function getGameConfig(supabase: SupabaseClient): Promise<FullGameConfig> {
  // Seed with defaults for every key
  const config = Object.fromEntries(
    Object.entries(GAME_CONFIG_REGISTRY).map(([key, { defaults }]) => [key, { ...defaults }])
  ) as FullGameConfig

  try {
    const { data: rows, error } = await supabase
      .from('game_config')
      .select('key, value')

    if (error) {
      console.warn('getGameConfig: DB fetch failed, using defaults', error.message)
      return config
    }

    for (const row of rows ?? []) {
      const key   = row.key as GameConfigKey
      const entry = GAME_CONFIG_REGISTRY[key]
      if (!entry) continue

      const parsed = entry.schema.safeParse(row.value)
      if (parsed.success) {
        // Deep-merge: DB values override defaults, unknown keys are ignored
        ;(config as Record<string, unknown>)[key] = {
          ...(config as Record<string, unknown>)[key],
          ...parsed.data,
        }
      } else {
        console.warn(
          `getGameConfig: invalid value for key "${key}", using defaults`,
          parsed.error.issues,
        )
      }
    }
  } catch (e) {
    console.warn('getGameConfig: unexpected error, using defaults', e)
  }

  return config
}
