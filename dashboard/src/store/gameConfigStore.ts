'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { type GameConfigKey } from '@shared/schemas'
import {
  buildDefaults,
  buildGameConfig,
  type FullGameConfig,
  type ConfigSource,
} from '@shared/gameConfig'

// ─── Types ────────────────────────────────────────────────────────────────────

/** @deprecated Use FullGameConfig from @shared/gameConfig */
export type GameConfigMap = FullGameConfig
export type { FullGameConfig, ConfigSource }

interface GameConfigState {
  /** Validated config — always fully populated (defaults where DB is missing). */
  config: FullGameConfig
  /** Per-key source tracking: is the value from DB or from code defaults? */
  sources: ConfigSource
  /** Local draft edits (not yet saved to DB). Keyed by config key. */
  drafts: Partial<FullGameConfig>
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
  setDraft: <K extends GameConfigKey>(key: K, value: Partial<FullGameConfig[K]>) => void
  /** Clear all drafts (revert to fetched config). */
  clearDrafts: () => void
  /** Clear the draft for a single config key. */
  clearDraftForKey: (key: GameConfigKey) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameConfigStore = create<GameConfigState>((set) => ({
  config:   buildDefaults(),
  sources:  buildGameConfig().sources,
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

      const { config, sources, warnings } = buildGameConfig(rows ?? [])
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
        [key]: { ...state.config[key], ...(state.drafts[key as keyof FullGameConfig] as object | undefined), ...value },
      },
    }))
  },

  clearDrafts: () => set({ drafts: {} }),

  clearDraftForKey: (key) => set((state) => {
    const next = { ...state.drafts }
    delete next[key]
    return { drafts: next }
  }),
}))
