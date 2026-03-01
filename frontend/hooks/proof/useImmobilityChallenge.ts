import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Accelerometer, Pedometer, Gyroscope } from 'expo-sensors';
import type { EventSubscription } from 'expo-modules-core';
import { SENSOR_UPDATE_INTERVAL } from '@/constants';
import type { DifficultyMode, UseImmobilityChallengeReturn, AccelerometerData, GyroscopeData, PedometerData, ChallengeStatus } from '@/types';
import { getThresholds } from '@/utils/proof/sensorHelpers';
import { logError } from '@/utils/errorHelpers';

/** Sensor listener subscription, typed via the SDK-exported `EventSubscription` from `expo-modules-core`. */
type Subscription = EventSubscription;

/**
 * Hook that runs the immobility challenge phase of the Proof-of-Poop flow.
 *
 * Subscribes to the accelerometer, gyroscope, and pedometer simultaneously.
 * The challenge passes when the user remains still (below per-`mode` thresholds)
 * for the required duration; it fails on excessive movement or step detection.
 *
 * @param mode - Sensitivity preset controlling movement thresholds and grace
 *   periods. Defaults to `'normal'`.
 * @returns Challenge status, elapsed time, `startChallenge` / `stopChallenge`
 *   callbacks, and sensor-derived flags.
 */
export const useImmobilityChallenge = (mode: DifficultyMode = 'normal'): UseImmobilityChallengeReturn => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState<ChallengeStatus>('idle');
  const [isRunning, setIsRunning] = useState(false);

  // Get thresholds for current mode
  const thresholds = useMemo(() => getThresholds(mode), [mode]);

  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const graceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningCooldownRef = useRef<NodeJS.Timeout | null>(null);
  const accelerometerSubscriptionRef = useRef<Subscription | null>(null);
  const pedometerSubscriptionRef = useRef<Subscription | null>(null);
  const gyroscopeSubscriptionRef = useRef<Subscription | null>(null);
  const initialStepCountRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);

  // Refs to stabilize callbacks and prevent stale closures
  const isRunningRef = useRef(isRunning);
  const statusRef = useRef(status);
  const thresholdsRef = useRef(thresholds);
  const mountedRef = useRef(true);

  // Keep refs in sync with state
  useEffect(() => {
    isRunningRef.current = isRunning;
    statusRef.current = status;
    thresholdsRef.current = thresholds;
  }, [isRunning, status, thresholds]);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Single teardown function – clears every timer and sensor subscription.
  // Called from stopChallenge, the grace-period callback, and the unmount effect
  // so no code path can leak a phantom timer or subscription.
  const cleanup = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
      graceTimeoutRef.current = null;
    }
    if (warningCooldownRef.current) {
      clearTimeout(warningCooldownRef.current);
      warningCooldownRef.current = null;
    }
    if (accelerometerSubscriptionRef.current) {
      accelerometerSubscriptionRef.current.remove();
      accelerometerSubscriptionRef.current = null;
    }
    if (pedometerSubscriptionRef.current) {
      pedometerSubscriptionRef.current.remove();
      pedometerSubscriptionRef.current = null;
    }
    if (gyroscopeSubscriptionRef.current) {
      gyroscopeSubscriptionRef.current.remove();
      gyroscopeSubscriptionRef.current = null;
    }
  }, []);

  // Unified movement detection handler
  const handleMovementDetected = useCallback(() => {
    if (!mountedRef.current || !isRunningRef.current) return;

    // Movement detected - start grace period
    setStatus('warning');

    // Clear any existing cooldown
    if (warningCooldownRef.current) {
      clearTimeout(warningCooldownRef.current);
      warningCooldownRef.current = null;
    }

    // Clear existing grace timeout
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
    }

    // Set new grace timeout
    graceTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      
      // Grace period expired - reset challenge
      setIsRunning(false);
      setStatus('idle');
      setElapsedTime(0);
      cleanup();
    }, thresholdsRef.current.GRACE_PERIOD);
  }, [cleanup]); // ← depends only on the stable cleanup callback

  // Handle accelerometer data
  const handleAccelerometerData = useCallback(
    (data: AccelerometerData) => {
      if (!isRunningRef.current) return;

      const { x, y, z } = data;
      
      // Calculate movement magnitude (subtract gravity baseline)
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const movement = Math.abs(magnitude - 1);

      if (movement > thresholdsRef.current.MOVEMENT_THRESHOLD) {
        // Movement detected from accelerometer
        handleMovementDetected();
      } else {
        // No movement detected right now
        
        // If we're in warning state and haven't started cooldown yet, start it
        if (statusRef.current === 'warning' && !warningCooldownRef.current) {
          warningCooldownRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            
            // Cooldown complete - return to running status
            setStatus('running');
            warningCooldownRef.current = null;
            
            // Also clear grace timeout since we're back to immobile
            if (graceTimeoutRef.current) {
              clearTimeout(graceTimeoutRef.current);
              graceTimeoutRef.current = null;
            }
          }, thresholdsRef.current.WARNING_COOLDOWN);
        }
      }
    },
    [handleMovementDetected, cleanup]
  );

  // Handle step detection
  const handleStepDetection = useCallback(
    (result: PedometerData) => {
      if (!isRunningRef.current) return;

      const currentSteps = result.steps;
      
      // Set initial baseline from first callback
      if (initialStepCountRef.current === null) {
        initialStepCountRef.current = currentSteps;
        return; // Don't trigger on first reading
      }
      
      // Check if steps have increased
      if (currentSteps > initialStepCountRef.current) {
        // Update last step time
        lastStepTimeRef.current = Date.now();
      }

      // Check if we have recent steps (within cooldown window)
      const timeSinceLastStep = Date.now() - lastStepTimeRef.current;
      
      if (timeSinceLastStep < thresholdsRef.current.STEP_COOLDOWN) {
        // Recent steps detected - trigger movement
        handleMovementDetected();
      }
    },
    [handleMovementDetected]
  );

  // Handle gyroscope data
  const handleGyroscopeData = useCallback(
    (data: GyroscopeData) => {
      if (!isRunningRef.current) return;

      const { x, y, z } = data;
      
      // Calculate rotation magnitude
      const rotationMagnitude = Math.sqrt(x * x + y * y + z * z);

      if (rotationMagnitude > thresholdsRef.current.ROTATION_THRESHOLD) {
        // Rotation detected from gyroscope
        handleMovementDetected();
      } else {
        // No rotation detected right now
        
        // If we're in warning state and haven't started cooldown yet, start it
        if (statusRef.current === 'warning' && !warningCooldownRef.current) {
          warningCooldownRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            
            // Cooldown complete - return to running status
            setStatus('running');
            warningCooldownRef.current = null;
            
            // Also clear grace timeout since we're back to immobile
            if (graceTimeoutRef.current) {
              clearTimeout(graceTimeoutRef.current);
              graceTimeoutRef.current = null;
            }
          }, thresholdsRef.current.WARNING_COOLDOWN);
        }
      }
    },
    [handleMovementDetected, cleanup]
  );

  // Start challenge
  const startChallenge = useCallback(() => {
    setIsRunning(true);
    setStatus('running');
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Reset step tracking (will be initialized by first pedometer callback)
    initialStepCountRef.current = null;
    lastStepTimeRef.current = Date.now() - thresholdsRef.current.STEP_COOLDOWN; // Set in the past to avoid false positives

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setElapsedTime(elapsed);
    }, SENSOR_UPDATE_INTERVAL);
  }, []); // ← Stable callback

  // Stop challenge
  const stopChallenge = useCallback(() => {
    setIsRunning(false);
    setStatus('idle');
    setElapsedTime(0);
    cleanup();
  }, [cleanup]);

  // Subscribe to accelerometer when running
  useEffect(() => {
    if (!isRunning) {
      // Unsubscribe when not running
      if (accelerometerSubscriptionRef.current) {
        accelerometerSubscriptionRef.current.remove();
        accelerometerSubscriptionRef.current = null;
      }
      return;
    }

    // Set update interval
    Accelerometer.setUpdateInterval(SENSOR_UPDATE_INTERVAL);

    // Subscribe to accelerometer
    accelerometerSubscriptionRef.current = Accelerometer.addListener(
      handleAccelerometerData
    );

    // Cleanup on unmount or when stopping
    return () => {
      if (accelerometerSubscriptionRef.current) {
        accelerometerSubscriptionRef.current.remove();
        accelerometerSubscriptionRef.current = null;
      }
    };
  }, [isRunning, handleAccelerometerData]);

  // Subscribe to pedometer when running
  useEffect(() => {
    if (!isRunning) {
      // Unsubscribe when not running
      if (pedometerSubscriptionRef.current) {
        pedometerSubscriptionRef.current.remove();
        pedometerSubscriptionRef.current = null;
      }
      return;
    }

    // Subscribe to pedometer
    const subscribeToPedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (isAvailable) {
          pedometerSubscriptionRef.current = Pedometer.watchStepCount(
            handleStepDetection
          );
        }
      } catch (error) {
        // Silently handle pedometer subscription errors (device may not support it)
        logError('ImmobilityChallenge:Pedometer', error);
      }
    };

    subscribeToPedometer();

    // Cleanup on unmount or when stopping
    return () => {
      if (pedometerSubscriptionRef.current) {
        pedometerSubscriptionRef.current.remove();
        pedometerSubscriptionRef.current = null;
      }
    };
  }, [isRunning, handleStepDetection]);

  // Subscribe to gyroscope when running
  useEffect(() => {
    if (!isRunning) {
      // Unsubscribe when not running
      if (gyroscopeSubscriptionRef.current) {
        gyroscopeSubscriptionRef.current.remove();
        gyroscopeSubscriptionRef.current = null;
      }
      return;
    }

    // Set update interval
    Gyroscope.setUpdateInterval(SENSOR_UPDATE_INTERVAL);

    // Subscribe to gyroscope
    gyroscopeSubscriptionRef.current = Gyroscope.addListener(
      handleGyroscopeData
    );

    // Cleanup on unmount or when stopping
    return () => {
      if (gyroscopeSubscriptionRef.current) {
        gyroscopeSubscriptionRef.current.remove();
        gyroscopeSubscriptionRef.current = null;
      }
    };
  }, [isRunning, handleGyroscopeData]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return {
    elapsedTime,
    status,
    isRunning,
    startChallenge,
    stopChallenge,
  };
};
