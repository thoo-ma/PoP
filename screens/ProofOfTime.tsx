import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { colors, typography, layout } from '../constants/theme';
import { formatElapsedTime } from '../utils/timeFormatters';

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

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.timeBackground,
  },
  title: {
    ...typography.title,
    color: colors.timeTitle,
  },
  description: {
    ...typography.description,
    color: colors.timeText,
  },
  timerCard: {
    marginBottom: 16,
    minWidth: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.timeTitle,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  resetButton: {
    backgroundColor: colors.timeCard,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
    minWidth: 250,
  },
  hint: {
    ...typography.hint,
    color: colors.timeHint,
    marginTop: 24,
  },
});
