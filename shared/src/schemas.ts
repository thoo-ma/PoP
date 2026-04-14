/**
 * Zod schemas for game config validation.
 *
 * Each schema defines the validated shape of a config domain used by the
 * dashboard what-if previews and the config-tuner skill.
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

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Cooldown
// ═══════════════════════════════════════════════════════════════════════════════

export const CooldownConfigSchema = z.object({
  COOLDOWN_BASES: NFTTypeRecord(PositiveNumber.max(168)), // max 1 week
  LINEAR_MULT: PositiveNumber.max(10),
  EXP_MULT: PositiveNumber.max(1),
})

export type CooldownConfig = z.infer<typeof CooldownConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 3. XP
// ═══════════════════════════════════════════════════════════════════════════════

export const XpConfigSchema = z.object({
  XP_PER_USE: z.number().int().min(1).max(10_000),
  XP_FORMULA_BASE: PositiveNumber.max(10_000),
  XP_FORMULA_LINEAR: PositiveNumber.max(1_000),
  XP_FORMULA_QUADRATIC: PositiveNumber.max(100),
  XP_FORMULA_FLOOR: z.number().int().min(1).max(10_000),
})

export type XpConfig = z.infer<typeof XpConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Stat Points
// ═══════════════════════════════════════════════════════════════════════════════

export const StatPointsConfigSchema = z.object({
  STAT_POINTS_BY_RARITY: NFTRarityRecord(z.number().int().min(0).max(1000)),
})

export type StatPointsConfig = z.infer<typeof StatPointsConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Breed Probabilities
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Minting (Stat Ranges)
// ═══════════════════════════════════════════════════════════════════════════════

const StatRange = z.tuple([z.number().int().min(0).max(100), z.number().int().min(0).max(100)])

export const MintingConfigSchema = z.object({
  STAT_RANGES: NFTRarityRecord(StatRange),
})

export type MintingConfig = z.infer<typeof MintingConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Sensors
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Energy Drain
// ═══════════════════════════════════════════════════════════════════════════════

export const EnergyDrainConfigSchema = z.object({
  TYPE_DRAIN_MULT: NFTTypeRecord(PositiveNumber.max(100)),
  ENERGY_ROLL_MIN: PositiveNumber.max(100),
  ENERGY_ROLL_MAX: PositiveNumber.max(100),
})

export type EnergyDrainConfig = z.infer<typeof EnergyDrainConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Loot Roll
// ═══════════════════════════════════════════════════════════════════════════════

export const LootRollConfigSchema = z.object({
  BASE_WIN_PROBABILITY: z.number().min(0).max(1),
  PER_HOLD_INCREMENT: z.number().min(0).max(1),
  MAX_HOLDS: z.number().int().min(0).max(100),
})

export type LootRollConfig = z.infer<typeof LootRollConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Cloud Run
// ═══════════════════════════════════════════════════════════════════════════════

export const CloudRunConfigSchema = z.object({
  YAMNET_TOILET_FLUSH_CLASS: z.number().int().min(0).max(999),
  MAX_AUDIO_DURATION: PositiveNumber.max(300),
  MIN_AUDIO_DURATION: PositiveNumber.max(60),
  DETECTIONS_PER_DAY: z.number().int().min(1),
})

export type CloudRunConfig = z.infer<typeof CloudRunConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// 11. Degen Bar
// ═══════════════════════════════════════════════════════════════════════════════

export const DegenBarConfigSchema = z.object({
  SAFE_BUST_COEF: z.number().min(0).max(1),
  DEGEN_BUST_BASE: PositiveNumber.max(100),
  DEGEN_BUST_SCALE: PositiveNumber.max(1000),
  DEGEN_ZONE_THRESHOLD: z.number().min(0).max(99),
  MAX_REDUCTION: z.number().min(0).max(1),
})

export type DegenBarConfig = z.infer<typeof DegenBarConfigSchema>
