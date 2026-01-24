import { Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Card from '../components/Card';
import { colors } from '../constants/theme';
import { useImmobilityChallenge } from '../hooks/useImmobilityChallenge';
import type { DifficultyMode } from '../types';
import { formatTime } from '../utils/timeFormatters';
import { getStatusDisplay } from '../utils/statusHelpers';
import { styles } from '../styles/ProofOfImmobility.styles';

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
