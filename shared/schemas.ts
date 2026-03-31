/**
 * Zod schemas for all tunable game_config keys.
 *
 * Each schema defines the validated shape of one `game_config` row's JSONB
 * `value` column.  The corresponding `*_DEFAULTS` export is constructed
 * from the live constants in neighbouring files so it can never drift.
 *
 * Structural constants (MAX_LEVEL, MAX_ENERGY, MAX_STAT_VALUE, NFT types and
 * rarities) are NOT included — they are architectural invariants that must
 * never be changed at runtime.
 *
 * Safety guards (.min / .max) are production sanity checks, NOT dashboard
 * slider ranges.  They block clearly broken values (negative POOP, negative
 * cooldown, etc.) but leave plenty of headroom for creative balancing.
 */

import { z } from 'zod'

// ─── Re-usable sub-schemas ───────────────────────────────────────────────────

const NFTRarityRecord = <T extends z.ZodTypeAny>(val: T) =>
  z.object({
    common: val,
    rare: val,
    legendary: val,
    transcendent: val,
  })

const NFTTypeRecord = <T extends z.ZodTypeAny>(val: T) =>
  z.object({
    'turbo-flush': val,
    'cruise-seat': val,
    'zen-fortress': val,
  })

const DifficultyRecord = <T extends z.ZodTypeAny>(val: T) =>
  z.object({
    easy: val,
    normal: val,
    strict: val,
  })

const PositiveNumber = z.number().min(0)

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Currency
// ═══════════════════════════════════════════════════════════════════════════════

import {
  // Use reward
  REWARD_BASE_PRICE_USD,
  REWARD_GROWTH_RATE,
  REWARD_USD_PER_TOKEN,
  REWARD_TYPE_MULTIPLIER,
  REWARD_RARITY_MULTIPLIER,
  // Repair
  REPAIR_COEF_A,
  REPAIR_COEF_B,
  REPAIR_USD_PER_TOKEN,
  REPAIR_RARITY_MULTIPLIER,
  // Breed
  BREED_BASE_PRICE_USD,
  BREED_GROWTH_RATE,
  BREED_USD_PER_TOKEN,
  BREED_MAX_COUNT,
  BREED_RARITY_MULTIPLIER,
} from './currency.ts'

export const CurrencyConfigSchema = z.object({
  // ─── Use reward ────────────────────────────────────────────────────────────
  REWARD_BASE_PRICE_USD: z.number().min(0).max(1),
  REWARD_GROWTH_RATE: z.number().min(1).max(5),
  REWARD_USD_PER_TOKEN: z.number().min(0.0001).max(1),
  REWARD_TYPE_MULTIPLIER: NFTTypeRecord(PositiveNumber.max(100)),
  REWARD_RARITY_MULTIPLIER: NFTRarityRecord(PositiveNumber.max(1_000)),
  // ─── Repair ────────────────────────────────────────────────────────────────
  REPAIR_COEF_A: PositiveNumber.max(100),
  REPAIR_COEF_B: PositiveNumber.max(100),
  REPAIR_USD_PER_TOKEN: z.number().min(0.0001).max(1),
  REPAIR_RARITY_MULTIPLIER: NFTRarityRecord(PositiveNumber.max(100)),
  // ─── Breed ─────────────────────────────────────────────────────────────────
  BREED_BASE_PRICE_USD: PositiveNumber.max(100),
  BREED_GROWTH_RATE: z.number().min(1).max(10),
  BREED_USD_PER_TOKEN: z.number().min(0.0001).max(1),
  BREED_MAX_COUNT: z.number().int().min(1).max(20),
  BREED_RARITY_MULTIPLIER: NFTRarityRecord(PositiveNumber.max(1_000)),
})

export type CurrencyConfig = z.infer<typeof CurrencyConfigSchema>

export const CURRENCY_DEFAULTS: CurrencyConfig = {
  REWARD_BASE_PRICE_USD,
  REWARD_GROWTH_RATE,
  REWARD_USD_PER_TOKEN,
  REWARD_TYPE_MULTIPLIER: { ...REWARD_TYPE_MULTIPLIER },
  REWARD_RARITY_MULTIPLIER: { ...REWARD_RARITY_MULTIPLIER },
  REPAIR_COEF_A,
  REPAIR_COEF_B,
  REPAIR_USD_PER_TOKEN,
  REPAIR_RARITY_MULTIPLIER: { ...REPAIR_RARITY_MULTIPLIER },
  BREED_BASE_PRICE_USD,
  BREED_GROWTH_RATE,
  BREED_USD_PER_TOKEN,
  BREED_MAX_COUNT,
  BREED_RARITY_MULTIPLIER: { ...BREED_RARITY_MULTIPLIER },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Cooldown
// ═══════════════════════════════════════════════════════════════════════════════

import { COOLDOWN_BASES, LINEAR_MULT, EXP_MULT } from './cooldown.ts'

export const CooldownConfigSchema = z.object({
  COOLDOWN_BASES: NFTTypeRecord(PositiveNumber.max(168)), // max 1 week
  LINEAR_MULT: PositiveNumber.max(10),
  EXP_MULT: PositiveNumber.max(1),
})

export type CooldownConfig = z.infer<typeof CooldownConfigSchema>

export const COOLDOWN_DEFAULTS: CooldownConfig = {
  COOLDOWN_BASES: { ...COOLDOWN_BASES },
  LINEAR_MULT,
  EXP_MULT,
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. XP
// ═══════════════════════════════════════════════════════════════════════════════

import {
  XP_PER_USE,
  XP_FORMULA_BASE,
  XP_FORMULA_LINEAR,
  XP_FORMULA_QUADRATIC,
  XP_FORMULA_FLOOR,
} from './xp.ts'

export const XpConfigSchema = z.object({
  XP_PER_USE: z.number().int().min(1).max(10_000),
  XP_FORMULA_BASE: PositiveNumber.max(10_000),
  XP_FORMULA_LINEAR: PositiveNumber.max(1_000),
  XP_FORMULA_QUADRATIC: PositiveNumber.max(100),
  XP_FORMULA_FLOOR: z.number().int().min(1).max(10_000),
})

export type XpConfig = z.infer<typeof XpConfigSchema>

export const XP_DEFAULTS: XpConfig = {
  XP_PER_USE,
  XP_FORMULA_BASE,
  XP_FORMULA_LINEAR,
  XP_FORMULA_QUADRATIC,
  XP_FORMULA_FLOOR,
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Stat Points
// ═══════════════════════════════════════════════════════════════════════════════

import { STAT_POINTS_BY_RARITY } from './statPoints.ts'

export const StatPointsConfigSchema = z.object({
  STAT_POINTS_BY_RARITY: NFTRarityRecord(z.number().int().min(0).max(1000)),
})

export type StatPointsConfig = z.infer<typeof StatPointsConfigSchema>

export const STAT_POINTS_DEFAULTS: StatPointsConfig = {
  STAT_POINTS_BY_RARITY: { ...STAT_POINTS_BY_RARITY },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Breed Probabilities
// ═══════════════════════════════════════════════════════════════════════════════

import { BREED_PROBABILITIES } from './breedProbabilities.ts'

const ProbabilityTuple = z.tuple([
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
])

export const BreedConfigSchema = z.object({
  BREED_PROBABILITIES: z.object({
    'common+common': ProbabilityTuple,
    'common+rare': ProbabilityTuple,
    'rare+rare': ProbabilityTuple,
    'rare+legendary': ProbabilityTuple,
    'legendary+legendary': ProbabilityTuple,
    'legendary+transcendent': ProbabilityTuple,
    'transcendent+transcendent': ProbabilityTuple,
  }),
})

export type BreedConfig = z.infer<typeof BreedConfigSchema>

export const BREED_DEFAULTS: BreedConfig = {
  BREED_PROBABILITIES: { ...BREED_PROBABILITIES },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Minting (Stat Ranges)
// ═══════════════════════════════════════════════════════════════════════════════

import { STAT_RANGES } from './minting.ts'

const StatRange = z.tuple([z.number().int().min(0).max(100), z.number().int().min(0).max(100)])

export const MintingConfigSchema = z.object({
  STAT_RANGES: NFTRarityRecord(StatRange),
})

export type MintingConfig = z.infer<typeof MintingConfigSchema>

export const MINTING_DEFAULTS: MintingConfig = {
  STAT_RANGES: {
    common: [...STAT_RANGES.common],
    rare: [...STAT_RANGES.rare],
    legendary: [...STAT_RANGES.legendary],
    transcendent: [...STAT_RANGES.transcendent],
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Sensors
// ═══════════════════════════════════════════════════════════════════════════════

import { SENSOR_PRESETS, AUDIO_THRESHOLDS } from './sensors.ts'

const SensorThresholdsSchema = z.object({
  MOVEMENT_THRESHOLD: PositiveNumber.max(10),
  ROTATION_THRESHOLD: PositiveNumber.max(10),
  STEP_COOLDOWN: z.number().int().min(0).max(60_000),
  GRACE_PERIOD: z.number().int().min(0).max(60_000),
  WARNING_COOLDOWN: z.number().int().min(0).max(60_000),
})

export const SensorsConfigSchema = z.object({
  SENSOR_PRESETS: DifficultyRecord(SensorThresholdsSchema),
  AUDIO_THRESHOLDS: DifficultyRecord(z.number().min(0).max(1)),
})

export type SensorsConfig = z.infer<typeof SensorsConfigSchema>

export const SENSORS_DEFAULTS: SensorsConfig = {
  SENSOR_PRESETS: {
    easy: { ...SENSOR_PRESETS.easy },
    normal: { ...SENSOR_PRESETS.normal },
    strict: { ...SENSOR_PRESETS.strict },
  },
  AUDIO_THRESHOLDS: { ...AUDIO_THRESHOLDS },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Energy Drain
// ═══════════════════════════════════════════════════════════════════════════════

import { TYPE_DRAIN_MULT, ENERGY_ROLL_MIN, ENERGY_ROLL_MAX } from './energyDrain.ts'

export const EnergyDrainConfigSchema = z.object({
  TYPE_DRAIN_MULT: NFTTypeRecord(PositiveNumber.max(100)),
  ENERGY_ROLL_MIN: PositiveNumber.max(100),
  ENERGY_ROLL_MAX: PositiveNumber.max(100),
})

export type EnergyDrainConfig = z.infer<typeof EnergyDrainConfigSchema>

export const ENERGY_DRAIN_DEFAULTS: EnergyDrainConfig = {
  TYPE_DRAIN_MULT: { ...TYPE_DRAIN_MULT },
  ENERGY_ROLL_MIN,
  ENERGY_ROLL_MAX,
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Loot Roll
// ═══════════════════════════════════════════════════════════════════════════════

import { BASE_WIN_PROBABILITY, PER_HOLD_INCREMENT, MAX_HOLDS } from './lootRoll.ts'

export const LootRollConfigSchema = z.object({
  BASE_WIN_PROBABILITY: z.number().min(0).max(1),
  PER_HOLD_INCREMENT: z.number().min(0).max(1),
  MAX_HOLDS: z.number().int().min(0).max(100),
})

export type LootRollConfig = z.infer<typeof LootRollConfigSchema>

export const LOOT_ROLL_DEFAULTS: LootRollConfig = {
  BASE_WIN_PROBABILITY,
  PER_HOLD_INCREMENT,
  MAX_HOLDS,
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Cloud Run
// ═══════════════════════════════════════════════════════════════════════════════

import {
  YAMNET_TOILET_FLUSH_CLASS,
  MAX_AUDIO_DURATION,
  MIN_AUDIO_DURATION,
  DETECTIONS_PER_DAY,
} from './cloudRun.ts'

export const CloudRunConfigSchema = z.object({
  YAMNET_TOILET_FLUSH_CLASS: z.number().int().min(0).max(999),
  MAX_AUDIO_DURATION: PositiveNumber.max(300),
  MIN_AUDIO_DURATION: PositiveNumber.max(60),
  DETECTIONS_PER_DAY: z.number().int().min(1),
})

export type CloudRunConfig = z.infer<typeof CloudRunConfigSchema>

export const CLOUD_RUN_DEFAULTS: CloudRunConfig = {
  YAMNET_TOILET_FLUSH_CLASS,
  MAX_AUDIO_DURATION,
  MIN_AUDIO_DURATION,
  DETECTIONS_PER_DAY,
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. Degen Bar
// ═══════════════════════════════════════════════════════════════════════════════

import {
  SAFE_BUST_COEF,
  DEGEN_BUST_BASE,
  DEGEN_BUST_SCALE,
  DEGEN_ZONE_THRESHOLD,
  MAX_REDUCTION,
} from './degenBar.ts'

export const DegenBarConfigSchema = z.object({
  SAFE_BUST_COEF: z.number().min(0).max(1),
  DEGEN_BUST_BASE: PositiveNumber.max(100),
  DEGEN_BUST_SCALE: PositiveNumber.max(1000),
  DEGEN_ZONE_THRESHOLD: z.number().min(0).max(99),
  MAX_REDUCTION: z.number().min(0).max(1),
})

export type DegenBarConfig = z.infer<typeof DegenBarConfigSchema>

export const DEGEN_BAR_DEFAULTS: DegenBarConfig = {
  SAFE_BUST_COEF,
  DEGEN_BUST_BASE,
  DEGEN_BUST_SCALE,
  DEGEN_ZONE_THRESHOLD,
  MAX_REDUCTION,
}

// ═══════════════════════════════════════════════════════════════════════════════
// Master registry — maps game_config row keys to their schema + defaults
// ═══════════════════════════════════════════════════════════════════════════════

export const GAME_CONFIG_REGISTRY = {
  currency: { schema: CurrencyConfigSchema, defaults: CURRENCY_DEFAULTS },
  cooldown: { schema: CooldownConfigSchema, defaults: COOLDOWN_DEFAULTS },
  xp: { schema: XpConfigSchema, defaults: XP_DEFAULTS },
  stat_points: { schema: StatPointsConfigSchema, defaults: STAT_POINTS_DEFAULTS },
  breed: { schema: BreedConfigSchema, defaults: BREED_DEFAULTS },
  minting: { schema: MintingConfigSchema, defaults: MINTING_DEFAULTS },
  sensors: { schema: SensorsConfigSchema, defaults: SENSORS_DEFAULTS },
  energy_drain: { schema: EnergyDrainConfigSchema, defaults: ENERGY_DRAIN_DEFAULTS },
  loot_roll: { schema: LootRollConfigSchema, defaults: LOOT_ROLL_DEFAULTS },
  cloud_run: { schema: CloudRunConfigSchema, defaults: CLOUD_RUN_DEFAULTS },
  degen_bar: { schema: DegenBarConfigSchema, defaults: DEGEN_BAR_DEFAULTS },
} as const

export type GameConfigKey = keyof typeof GAME_CONFIG_REGISTRY
