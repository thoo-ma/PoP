'use client'

import { create } from 'zustand'

// ─── Imports: all tunable constants from @pop/shared ──────────────────────────

import {
  AUDIO_THRESHOLDS,
  BASE_WIN_PROBABILITY,
  BREED_BASE_PRICE_USD,
  BREED_GROWTH_RATE,
  BREED_MAX_COUNT,
  BREED_PROBABILITIES,
  BREED_RARITY_MULTIPLIER,
  BREED_USD_PER_TOKEN,
  COOLDOWN_BASES,
  DEGEN_BUST_BASE,
  DEGEN_BUST_SCALE,
  DEGEN_ZONE_THRESHOLD,
  DETECTIONS_PER_DAY,
  ENERGY_ROLL_MAX,
  ENERGY_ROLL_MIN,
  EXP_MULT,
  LINEAR_MULT,
  MAX_AUDIO_DURATION,
  MAX_HOLDS,
  MAX_REDUCTION,
  MIN_AUDIO_DURATION,
  PER_HOLD_INCREMENT,
  REPAIR_COEF_A,
  REPAIR_COEF_B,
  REPAIR_RARITY_MULTIPLIER,
  REPAIR_USD_PER_TOKEN,
  REWARD_BASE_PRICE_USD,
  REWARD_GROWTH_RATE,
  REWARD_RARITY_MULTIPLIER,
  REWARD_TYPE_MULTIPLIER,
  REWARD_USD_PER_TOKEN,
  SAFE_BUST_COEF,
  SENSOR_PRESETS,
  STAT_POINTS_BY_RARITY,
  STAT_RANGES,
  TYPE_DRAIN_MULT,
  XP_FORMULA_BASE,
  XP_FORMULA_FLOOR,
  XP_FORMULA_LINEAR,
  XP_FORMULA_QUADRATIC,
  XP_PER_USE,
  YAMNET_TOILET_FLUSH_CLASS,
} from '@pop/shared'
import type {
  BreedConfig,
  CloudRunConfig,
  CooldownConfig,
  CurrencyConfig,
  DegenBarConfig,
  EnergyDrainConfig,
  LootRollConfig,
  MintingConfig,
  SensorsConfig,
  StatPointsConfig,
  XpConfig,
} from '@pop/shared/schemas'

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameConfigKey =
  | 'currency'
  | 'cooldown'
  | 'xp'
  | 'stat_points'
  | 'breed'
  | 'minting'
  | 'sensors'
  | 'energy_drain'
  | 'loot_roll'
  | 'cloud_run'
  | 'degen_bar'

export interface GameConfig {
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

interface GameConfigState {
  /** Config values — assembled from code constants. */
  config: GameConfig
  /** Local draft edits for what-if previews. */
  drafts: Partial<GameConfig>

  /** Update a draft value locally. */
  setDraft: <K extends GameConfigKey>(key: K, value: Partial<GameConfig[K]>) => void
  /** Clear all drafts. */
  clearDrafts: () => void
  /** Clear the draft for a single config key. */
  clearDraftForKey: (key: GameConfigKey) => void
}

// ─── Static config built from code constants ──────────────────────────────────

const CONFIG: GameConfig = {
  currency: {
    REWARD_BASE_PRICE_USD,
    REWARD_GROWTH_RATE,
    REWARD_USD_PER_TOKEN,
    REWARD_TYPE_MULTIPLIER,
    REWARD_RARITY_MULTIPLIER,
    REPAIR_COEF_A,
    REPAIR_COEF_B,
    REPAIR_USD_PER_TOKEN,
    REPAIR_RARITY_MULTIPLIER,
    BREED_BASE_PRICE_USD,
    BREED_GROWTH_RATE,
    BREED_USD_PER_TOKEN,
    BREED_MAX_COUNT,
    BREED_RARITY_MULTIPLIER,
  },
  cooldown: { COOLDOWN_BASES, LINEAR_MULT, EXP_MULT },
  xp: { XP_PER_USE, XP_FORMULA_BASE, XP_FORMULA_LINEAR, XP_FORMULA_QUADRATIC, XP_FORMULA_FLOOR },
  stat_points: { STAT_POINTS_BY_RARITY },
  breed: { BREED_PROBABILITIES },
  minting: { STAT_RANGES },
  sensors: { SENSOR_PRESETS, AUDIO_THRESHOLDS },
  energy_drain: { TYPE_DRAIN_MULT, ENERGY_ROLL_MIN, ENERGY_ROLL_MAX },
  loot_roll: { BASE_WIN_PROBABILITY, PER_HOLD_INCREMENT, MAX_HOLDS },
  cloud_run: {
    YAMNET_TOILET_FLUSH_CLASS,
    MAX_AUDIO_DURATION,
    MIN_AUDIO_DURATION,
    DETECTIONS_PER_DAY,
  },
  degen_bar: {
    SAFE_BUST_COEF,
    DEGEN_BUST_BASE,
    DEGEN_BUST_SCALE,
    DEGEN_ZONE_THRESHOLD,
    MAX_REDUCTION,
  },
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameConfigStore = create<GameConfigState>((set) => ({
  config: CONFIG,
  drafts: {},

  setDraft: (key, value) => {
    set((state) => ({
      drafts: {
        ...state.drafts,
        [key]: {
          ...state.config[key],
          ...(state.drafts[key as keyof GameConfig] as object | undefined),
          ...value,
        },
      },
    }))
  },

  clearDrafts: () => set({ drafts: {} }),

  clearDraftForKey: (key) =>
    set((state) => {
      const next = { ...state.drafts }
      delete next[key]
      return { drafts: next }
    }),
}))
