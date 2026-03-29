/**
 * Sensor data from accelerometer
 */
export interface AccelerometerData {
  x: number
  y: number
  z: number
}

/**
 * Sensor data from gyroscope
 */
export interface GyroscopeData {
  x: number
  y: number
  z: number
}

/**
 * Pedometer step count result
 */
export interface PedometerData {
  steps: number
}

/**
 * Challenge status types
 */
export type ChallengeStatus = 'idle' | 'running' | 'warning'

/**
 * Used by useImmobilityChallenge
 */
export interface UseImmobilityChallengeReturn {
  elapsedTime: number
  status: ChallengeStatus
  isRunning: boolean
  startChallenge: () => void
  stopChallenge: () => void
}
