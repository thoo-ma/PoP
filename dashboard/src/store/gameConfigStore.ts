'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
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
} from '@shared/schemas'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Full validated game config — every key guaranteed present (defaults fallback). */
export type GameConfigMap = {
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

/** Tracks which keys have live DB overrides vs using defaults. */
export type ConfigSource = Record<GameConfigKey, 'db' | 'defaults'>

interface GameConfigState {
  /** Validated config — always fully populated (defaults where DB is missing). */
  config: GameConfigMap
  /** Per-key source tracking: is the value from DB or from code defaults? */
  sources: ConfigSource
  /** Local draft edits (not yet saved to DB). Keyed by config key. */
  drafts: Partial<GameConfigMap>
  /** Loading state */
  loading: boolean
  /** Error message (null = no error) */
  error: string | null
  /** Keys that failed Zod validation (DB row exists but is malformed — using defaults). */
  warnings: string[]

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Fetch game_config from Supabase, validate with Zod, merge over defaults. */
  fetch: () => Promise<void>
  /** Update a draft value locally (does NOT write to DB). */
  setDraft: <K extends GameConfigKey>(key: K, value: Partial<GameConfigMap[K]>) => void
  /** Clear all drafts (revert to fetched config). */
  clearDrafts: () => void
}

// ─── Build initial defaults from GAME_CONFIG_REGISTRY ─────────────────────────

function buildDefaults(): GameConfigMap {
  return Object.fromEntries(
    Object.entries(GAME_CONFIG_REGISTRY).map(([key, { defaults }]) => [key, { ...defaults }])
  ) as GameConfigMap
}

function buildDefaultSources(): ConfigSource {
  return Object.fromEntries(
    Object.keys(GAME_CONFIG_REGISTRY).map((key) => [key, 'defaults' as const])
  ) as ConfigSource
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameConfigStore = create<GameConfigState>((set) => ({
  config:   buildDefaults(),
  sources:  buildDefaultSources(),
  drafts:   {},
  loading:  true,
  error:    null,
  warnings: [],

  fetch: async () => {
    set({ loading: true, error: null, warnings: [] })

    if (!supabase) {
      set({ loading: false, error: 'Supabase not configured (missing env vars)' })
      return
    }

    try {
      const { data: rows, error: dbError } = await supabase
        .from('game_config')
        .select('key, value')

      if (dbError) throw new Error(dbError.message)

      const config  = buildDefaults()
      const sources = buildDefaultSources()

      const warnings: string[] = []

      for (const row of rows ?? []) {
        const key   = row.key as GameConfigKey
        const entry = GAME_CONFIG_REGISTRY[key]
        if (!entry) continue

        const parsed = entry.schema.safeParse(row.value)
        if (parsed.success) {
          const existing = (config as Record<string, unknown>)[key]
          ;(config as Record<string, unknown>)[key] = Object.assign(
            {},
            existing,
            parsed.data,
          )
          sources[key] = 'db'
        } else {
          const issues = parsed.error.issues.map((i) => i.message).join('; ')
          warnings.push(`"${key}" failed validation — using defaults (${issues})`)
          console.warn(
            `[gameConfigStore] Invalid DB value for "${key}", using defaults:`,
            parsed.error.issues,
          )
          // sources[key] stays 'defaults'
        }
      }

      set({ config, sources, loading: false, warnings })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load game config'
      console.error('[gameConfigStore] fetch error:', msg)
      set({ error: msg, loading: false })
    }
  },

  setDraft: (key, value) => {
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: { ...state.config[key], ...state.drafts[key], ...value },
      },
    }))
  },

  clearDrafts: () => set({ drafts: {} }),
}))
