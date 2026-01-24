import { Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Card } from '../components';
import { colors } from '../constants';
import { useImmobilityChallenge } from '../hooks';
import type { DifficultyMode } from '../types';
import { formatTime, getStatusDisplay } from '../utils';
import { proofOfImmobilityStyles as styles } from '../styles';

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

  const statusDisplay = getStatusDisplay(status, colors.immobilityValue);

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
