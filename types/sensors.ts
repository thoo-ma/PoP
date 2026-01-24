/**
 * Sensor data from accelerometer
 */
export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

/**
 * Sensor data from gyroscope
 */
export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

/**
 * Pedometer step count result
 */
export interface PedometerData {
  steps: number;
}

/**
 * Thresholds for different difficulty modes
 */
export interface SensorThresholds {
  MOVEMENT_THRESHOLD: number;
  ROTATION_THRESHOLD: number;
  STEP_COOLDOWN: number;
  GRACE_PERIOD: number;
  WARNING_COOLDOWN: number;
}

/**
 * Challenge status types
 */
export type ChallengeStatus = 'idle' | 'running' | 'warning';
