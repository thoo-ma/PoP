import type { DifficultyMode, SensorThresholds } from '../types';

/**
 * Get thresholds based on difficulty mode
 */
export const getThresholds = (mode: DifficultyMode = 'normal'): SensorThresholds => {
  switch (mode) {
    case 'easy':
      return {
        MOVEMENT_THRESHOLD: 0.20,
        ROTATION_THRESHOLD: 0.15,
        STEP_COOLDOWN: 2500,
        GRACE_PERIOD: 800,
        WARNING_COOLDOWN: 2000,
      };
    case 'normal':
      return {
        MOVEMENT_THRESHOLD: 0.15,
        ROTATION_THRESHOLD: 0.1,
        STEP_COOLDOWN: 1500,
        GRACE_PERIOD: 500,
        WARNING_COOLDOWN: 1500,
      };
    case 'strict':
      return {
        MOVEMENT_THRESHOLD: 0.08,
        ROTATION_THRESHOLD: 0.05,
        STEP_COOLDOWN: 1000,
        GRACE_PERIOD: 300,
        WARNING_COOLDOWN: 1000,
      };
  }
};

/**
 * Get detection threshold based on difficulty mode
 * Used for audio detection (toilet flush, etc.)
 * @param mode - Difficulty mode
 * @returns Threshold value between 0.0 and 1.0
 */
export const getThresholdForDifficulty = (mode: DifficultyMode): number => {
  switch (mode) {
    case 'easy':
      return 0.3;
    case 'normal':
      return 0.5;
    case 'strict':
      return 0.7;
  }
};
