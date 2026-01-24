import { View, Text, TouchableOpacity } from 'react-native';
import type { DifficultyMode } from '../../types';
import { styles } from '../../styles/DifficultySelector.styles';

interface DifficultySelectorProps {
  mode: DifficultyMode;
  onModeChange: () => void;
  disabled: boolean;
}

export default function DifficultySelector({ mode, onModeChange, disabled }: DifficultySelectorProps) {
  const displayMode = mode.charAt(0).toUpperCase() + mode.slice(1);
  
  return (
    <View style={styles.modeContainer}>
      <Text style={styles.modeLabel}>Difficulty:</Text>
      <TouchableOpacity
        style={styles.modeButton}
        onPress={onModeChange}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={styles.modeButtonText}>{displayMode}</Text>
      </TouchableOpacity>
    </View>
  );
}
