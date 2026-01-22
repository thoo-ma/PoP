import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Card from '../components/Card';
import { colors, typography, layout } from '../constants/theme';
import { useImmobilityChallenge } from '../hooks/useImmobilityChallenge';
import type { DifficultyMode } from '../types';

export default function ProofOfImmobility() {
  const [mode, setMode] = useState<DifficultyMode>('normal');
  const { elapsedTime, status, isRunning, startChallenge, stopChallenge } = useImmobilityChallenge(mode);

  // Cycle through difficulty modes
  const cycleDifficulty = () => {
    if (isRunning) return;
    
    if (mode === 'easy') {
      setMode('normal');
    } else if (mode === 'normal') {
      setMode('strict');
    } else {
      setMode('easy');
    }
  };

  // Format time as MM:SS:MS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Show centiseconds (00-99)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  // Get status display text and color
  const getStatusDisplay = () => {
    if (status === 'idle') {
      return { text: 'Ready', icon: '📍', color: colors.immobilityValue };
    } else if (status === 'warning') {
      return { text: 'Movement Detected ⚠️', icon: '⚠️', color: '#ff6b6b' }; // Red
    } else {
      return { text: 'Immobile ✓', icon: '✓', color: '#4ade80' }; // Green
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Immobility</Text>
      <Text style={styles.description}>
        Start the challenge and stay still{'\n'}
        Any movement will reset the timer
      </Text>
      
      {/* Difficulty Mode Selection */}
      <View style={styles.modeContainer}>
        <Text style={styles.modeLabel}>Difficulty:</Text>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={cycleDifficulty}
          activeOpacity={0.7}
        >
          <Text style={styles.modeButtonText}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Card
        title="Status"
        value={statusDisplay.text}
        titleColor={colors.immobilityCard}
        valueColor={statusDisplay.color}
        style={styles.card}
      />

      <Card
        title="Current Time"
        value={formatTime(elapsedTime)}
        titleColor={colors.immobilityCard}
        valueColor={colors.immobilityValue}
        style={styles.card}
      />
      
      <TouchableOpacity
        style={[styles.button, isRunning && styles.buttonStop]}
        onPress={isRunning ? stopChallenge : startChallenge}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'STOP CHALLENGE' : 'START CHALLENGE'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.hint}>← Swipe to navigate →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.immobilityBackground,
  },
  title: {
    ...typography.title,
    color: colors.immobilityTitle,
  },
  description: {
    ...typography.description,
    color: colors.immobilityText,
  },
  card: {
    marginBottom: 24,
  },
  modeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.immobilityText,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.immobilityCard,
    minWidth: 120,
    alignItems: 'center',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.immobilityCard,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonStop: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  hint: {
    ...typography.hint,
    color: colors.immobilityHint,
  },
});
