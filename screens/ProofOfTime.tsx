import { Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Card } from '../components';
import { colors } from '../constants';
import { formatElapsedTime } from '../utils';
import { proofOfTimeStyles as styles } from '../styles';

export default function ProofOfTime() {
  const [time, setTime] = useState(new Date());
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerStartRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerStartRef.current) {
          setElapsedTime(Date.now() - timerStartRef.current);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      // Stop timer
      setIsTimerRunning(false);
      timerStartRef.current = null;
    } else {
      // Start timer
      setIsTimerRunning(true);
      timerStartRef.current = Date.now() - elapsedTime;
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(0);
    timerStartRef.current = null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Time</Text>
      <Text style={styles.description}>
        Time is your most precious resource{'\n'}
        Every second counts
      </Text>
      
      <Card
        title="⏱️ Timer"
        value={formatElapsedTime(elapsedTime)}
        titleColor={colors.timeCard}
        valueColor={colors.timeValue}
        style={styles.timerCard}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isTimerRunning && styles.stopButton]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isTimerRunning ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
        
        {elapsedTime > 0 && !isTimerRunning && (
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Card
        title="⏰ Current Time"
        value={time.toLocaleTimeString('en-US')}
        titleColor={colors.timeCard}
        valueColor={colors.timeValue}
        style={styles.card}
      />
      
      <Card
        title="📅 Date"
        value={time.toLocaleDateString('en-US')}
        titleColor={colors.timeCard}
        valueColor={colors.timeValue}
        style={styles.card}
      />
      
      <Text style={styles.hint}>← Swipe to go back</Text>
    </View>
  );
}
