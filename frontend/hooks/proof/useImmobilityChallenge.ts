import { useState, useEffect, useRef, useCallback } from 'react';
import { Accelerometer, Pedometer, Gyroscope } from 'expo-sensors';
import { SENSOR_UPDATE_INTERVAL } from '../../constants';
import type { DifficultyMode, UseImmobilityChallengeReturn, AccelerometerData, GyroscopeData, PedometerData, ChallengeStatus } from '../../types';
import { getThresholds } from '../../utils/proof/sensorHelpers';
import { logError } from '../../utils/errorHelpers';

type Subscription = ReturnType<typeof Accelerometer.addListener>;

export const useImmobilityChallenge = (mode: DifficultyMode = 'normal'): UseImmobilityChallengeReturn => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState<ChallengeStatus>('idle');
  const [isRunning, setIsRunning] = useState(false);

  // Get thresholds for current mode
  const thresholds = getThresholds(mode);

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
  });

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
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
      
      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }, thresholdsRef.current.GRACE_PERIOD);
  }, []); // ← Now stable, no dependencies!

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
    [handleMovementDetected] // ← Only depends on handleMovementDetected now
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
    [handleMovementDetected] // ← Only depends on handleMovementDetected now
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
    [handleMovementDetected] // ← Only depends on handleMovementDetected now
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

    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Clear grace timeout
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
      graceTimeoutRef.current = null;
    }

    // Clear warning cooldown
    if (warningCooldownRef.current) {
      clearTimeout(warningCooldownRef.current);
      warningCooldownRef.current = null;
    }
  }, []);

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
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (graceTimeoutRef.current) {
        clearTimeout(graceTimeoutRef.current);
      }
      if (warningCooldownRef.current) {
        clearTimeout(warningCooldownRef.current);
      }
      if (accelerometerSubscriptionRef.current) {
        accelerometerSubscriptionRef.current.remove();
      }
      if (pedometerSubscriptionRef.current) {
        pedometerSubscriptionRef.current.remove();
      }
      if (gyroscopeSubscriptionRef.current) {
        gyroscopeSubscriptionRef.current.remove();
      }
    };
  }, []);

  return {
    elapsedTime,
    status,
    isRunning,
    startChallenge,
    stopChallenge,
  };
};
