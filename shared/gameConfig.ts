/**
 * Shared game-config helpers — used by Edge Functions, the React Native app,
 * and the Next.js dashboard.
 *
 * Import path per runtime:
 *   Edge Functions   →  import { … } from '../../../shared/gameConfig.ts'
 *   Frontend / Dashboard  →  import { … } from '@shared/gameConfig'
 *
 * Not re-exported from shared/index.ts because this file depends on Zod
 * (via schemas.ts), just like schemas.ts itself.
 */

import {
  GAME_CONFIG_REGISTRY,
  type GameConfigKey,
  type CurrencyConfig,
  type CooldownConfig,
  type XpConfig,
  type StatPointsConfig,
  type BreedConfig,
  type MintingConfig,
  type SensorsConfig,
  type EnergyDrainConfig,
  type LootRollConfig,
  type CloudRunConfig,
  type DegenBarConfig,
} from './schemas.ts'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Full validated game config — every key is guaranteed present (defaults fallback). */
export type FullGameConfig = {
  currency: CurrencyConfig
  cooldown: CooldownConfig
  xp: XpConfig
  stat_points: StatPointsConfig
  breed: BreedConfig
  minting: MintingConfig
  sensors: SensorsConfig
  energy_drain: EnergyDrainConfig
  loot_roll: LootRollConfig
  cloud_run: CloudRunConfig
  degen_bar: DegenBarConfig
}

/** Per-key source tracking: did this value come from the DB or from code defaults? */
export type ConfigSource = Record<GameConfigKey, 'db' | 'defaults'>

// ─── Core helpers ─────────────────────────────────────────────────────────────

/** Build a FullGameConfig seeded entirely from the in-code defaults. */
export function buildDefaults(): FullGameConfig {
  return Object.fromEntries(
    Object.entries(GAME_CONFIG_REGISTRY).map(([key, { defaults }]) => [key, { ...defaults }]),
  ) as FullGameConfig
}

function buildDefaultSources(): ConfigSource {
  return Object.fromEntries(
    Object.keys(GAME_CONFIG_REGISTRY).map((key) => [key, 'defaults' as const]),
  ) as ConfigSource
}

// ─── Main factory ─────────────────────────────────────────────────────────────

/**
 * Validate and merge an array of raw `game_config` DB rows over defaults.
 *
 * @param rows  Raw rows from `SELECT key, value FROM game_config`.
 *              Omit or pass `[]` for a pure-defaults result.
 * @returns
 *   - `config`   — fully-populated FullGameConfig (DB values merged over defaults)
 *   - `sources`  — per-key 'db' | 'defaults' (used by the dashboard)
 *   - `warnings` — human-readable messages for rows that failed Zod validation
 */
export function buildGameConfig(rows: Array<{ key: string; value: unknown }> = []): {
  config: FullGameConfig
  sources: ConfigSource
  warnings: string[]
} {
  const config = buildDefaults()
  const sources = buildDefaultSources()
  const warnings: string[] = []

  for (const row of rows) {
    const key = row.key as GameConfigKey
    const entry = GAME_CONFIG_REGISTRY[key]
    if (!entry) continue

    const parsed = entry.schema.safeParse(row.value)
    if (parsed.success) {
      ;(config as Record<string, unknown>)[key] = Object.assign(
        {},
        (config as Record<string, unknown>)[key],
        parsed.data,
      )
      sources[key] = 'db'
    } else {
      const issues = parsed.error.issues.map((i) => i.message).join('; ')
      warnings.push(`"${key}" failed validation — using defaults (${issues})`)
    }
  }

  return { config, sources, warnings }
}
