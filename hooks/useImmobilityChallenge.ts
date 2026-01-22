import { useState, useEffect, useRef, useCallback } from 'react';
import { Accelerometer, Pedometer, Gyroscope } from 'expo-sensors';
import type { DifficultyMode, SensorThresholds } from '../types';

// Configuration constants
const UPDATE_INTERVAL = 100; // Accelerometer/Gyroscope update interval in milliseconds

// Get thresholds based on difficulty mode
const getThresholds = (mode: DifficultyMode = 'normal'): SensorThresholds => {
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

type ChallengeStatus = 'idle' | 'running' | 'warning';

export interface UseImmobilityChallengeReturn {
  elapsedTime: number;
  status: ChallengeStatus;
  isRunning: boolean;
  startChallenge: () => void;
  stopChallenge: () => void;
}

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
  const accelerometerSubscriptionRef = useRef<any>(null);
  const pedometerSubscriptionRef = useRef<any>(null);
  const gyroscopeSubscriptionRef = useRef<any>(null);
  const initialStepCountRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);

  // Format time - return milliseconds
  const formatTime = (ms: number): number => {
    return ms;
  };

  // Unified movement detection handler
  const handleMovementDetected = useCallback(() => {
    if (!isRunning) return;

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
      // Grace period expired - reset challenge
      setIsRunning(false);
      setStatus('idle');
      setElapsedTime(0);
      
      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }, thresholds.GRACE_PERIOD);
  }, [isRunning, thresholds.GRACE_PERIOD]);

  // Handle accelerometer data
  const handleAccelerometerData = useCallback(
    (data: { x: number; y: number; z: number }) => {
      if (!isRunning) return;

      const { x, y, z } = data;
      
      // Calculate movement magnitude (subtract gravity baseline)
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const movement = Math.abs(magnitude - 1);

      if (movement > thresholds.MOVEMENT_THRESHOLD) {
        // Movement detected from accelerometer
        handleMovementDetected();
      } else {
        // No movement detected right now
        
        // If we're in warning state and haven't started cooldown yet, start it
        if (status === 'warning' && !warningCooldownRef.current) {
          warningCooldownRef.current = setTimeout(() => {
            // Cooldown complete - return to running status
            setStatus('running');
            warningCooldownRef.current = null;
            
            // Also clear grace timeout since we're back to immobile
            if (graceTimeoutRef.current) {
              clearTimeout(graceTimeoutRef.current);
              graceTimeoutRef.current = null;
            }
          }, thresholds.WARNING_COOLDOWN);
        }
      }
    },
    [isRunning, status, handleMovementDetected, thresholds.MOVEMENT_THRESHOLD, thresholds.WARNING_COOLDOWN]
  );

  // Handle step detection
  const handleStepDetection = useCallback(
    (result: { steps: number }) => {
      if (!isRunning) return;

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
      
      if (timeSinceLastStep < thresholds.STEP_COOLDOWN) {
        // Recent steps detected - trigger movement
        handleMovementDetected();
      }
    },
    [isRunning, handleMovementDetected, thresholds.STEP_COOLDOWN]
  );

  // Handle gyroscope data
  const handleGyroscopeData = useCallback(
    (data: { x: number; y: number; z: number }) => {
      if (!isRunning) return;

      const { x, y, z } = data;
      
      // Calculate rotation magnitude
      const rotationMagnitude = Math.sqrt(x * x + y * y + z * z);

      if (rotationMagnitude > thresholds.ROTATION_THRESHOLD) {
        // Rotation detected from gyroscope
        handleMovementDetected();
      } else {
        // No rotation detected right now
        
        // If we're in warning state and haven't started cooldown yet, start it
        if (status === 'warning' && !warningCooldownRef.current) {
          warningCooldownRef.current = setTimeout(() => {
            // Cooldown complete - return to running status
            setStatus('running');
            warningCooldownRef.current = null;
            
            // Also clear grace timeout since we're back to immobile
            if (graceTimeoutRef.current) {
              clearTimeout(graceTimeoutRef.current);
              graceTimeoutRef.current = null;
            }
          }, thresholds.WARNING_COOLDOWN);
        }
      }
    },
    [isRunning, status, handleMovementDetected, thresholds.ROTATION_THRESHOLD, thresholds.WARNING_COOLDOWN]
  );

  // Start challenge
  const startChallenge = useCallback(() => {
    setIsRunning(true);
    setStatus('running');
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Reset step tracking (will be initialized by first pedometer callback)
    initialStepCountRef.current = null;
    lastStepTimeRef.current = Date.now() - thresholds.STEP_COOLDOWN; // Set in the past to avoid false positives

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setElapsedTime(elapsed);
    }, UPDATE_INTERVAL);
  }, []);

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
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

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
        console.log('Pedometer subscription error:', error);
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
    Gyroscope.setUpdateInterval(UPDATE_INTERVAL);

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
    elapsedTime: formatTime(elapsedTime),
    status,
    isRunning,
    startChallenge,
    stopChallenge,
  };
};
