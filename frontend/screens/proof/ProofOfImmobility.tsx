import { Text, View, TouchableOpacity } from 'react-native';
import { Card, DifficultySelector } from '@/components';
import { colors } from '@/constants';
import { useImmobilityChallenge, useDifficultyCycle } from '@/hooks';
import { formatTime, getStatusDisplay } from '@/utils';
import { proofOfImmobilityStyles as styles } from '@/styles';

export default function ProofOfImmobility() {
  const { mode, cycleMode } = useDifficultyCycle('normal');
  const { elapsedTime, status, isRunning, startChallenge, stopChallenge } = useImmobilityChallenge(mode);

  // Cycle through difficulty modes only when not running
  const handleCycleMode = () => {
    if (isRunning) return;
    cycleMode();
  };

  const statusDisplay = getStatusDisplay(status, colors.title);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Immobility</Text>
      <Text style={styles.description}>
        Start the challenge and stay still{'\n'}
        Any movement will reset the timer
      </Text>
      
      <DifficultySelector 
        mode={mode} 
        onModeChange={handleCycleMode}
        disabled={isRunning}
      />
      
      <Card
        title="Status"
        value={statusDisplay.text}
        titleColor={colors.buttonPrimary}
        valueColor={statusDisplay.color}
        style={styles.card}
      />

      <Card
        title="Current Time"
        value={formatTime(elapsedTime)}
        titleColor={colors.buttonPrimary}
        valueColor={colors.title}
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

    </View>
  );
}
