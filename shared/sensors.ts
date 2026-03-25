/**
 * Sensor & difficulty threshold constants — single source of truth for
 * frontend, dashboard, and Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/sensors.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DifficultyMode = 'easy' | 'normal' | 'strict';

export interface SensorThresholds {
  MOVEMENT_THRESHOLD: number;
  ROTATION_THRESHOLD: number;
  STEP_COOLDOWN: number;
  GRACE_PERIOD: number;
  WARNING_COOLDOWN: number;
}

// ─── Sensor difficulty presets ────────────────────────────────────────────────

// @migration: UNCERTAIN — in DB schema (seeded + dashboard-editable) but marked as structural in the game config audit; resolve before removing
export const SENSOR_PRESETS: Record<DifficultyMode, SensorThresholds> = {
  easy: {
    MOVEMENT_THRESHOLD: 0.20,
    ROTATION_THRESHOLD: 0.15,
    STEP_COOLDOWN: 2500,
    GRACE_PERIOD: 800,
    WARNING_COOLDOWN: 2000,
  },
  normal: {
    MOVEMENT_THRESHOLD: 0.15,
    ROTATION_THRESHOLD: 0.10,
    STEP_COOLDOWN: 1500,
    GRACE_PERIOD: 500,
    WARNING_COOLDOWN: 1500,
  },
  strict: {
    MOVEMENT_THRESHOLD: 0.08,
    ROTATION_THRESHOLD: 0.05,
    STEP_COOLDOWN: 1000,
    GRACE_PERIOD: 300,
    WARNING_COOLDOWN: 1000,
  },
};

/** Get sensor thresholds for a given difficulty mode. */
export function getThresholds(mode: DifficultyMode = 'normal'): SensorThresholds {
  return SENSOR_PRESETS[mode];
}

// ─── Audio detection thresholds per difficulty ────────────────────────────────

// @migration: UNCERTAIN — in DB schema (seeded + dashboard-editable) but marked as structural in the game config audit; resolve before removing
export const AUDIO_THRESHOLDS: Record<DifficultyMode, number> = {
  easy: 0.3,
  normal: 0.5,
  strict: 0.7,
};

/**
 * Get audio detection threshold for a given difficulty mode.
 * Used for toilet flush audio detection.
 * @returns Threshold value between 0.0 and 1.0
 */
export function getThresholdForDifficulty(mode: DifficultyMode): number {
  return AUDIO_THRESHOLDS[mode];
}
