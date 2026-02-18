import { View, Text, TouchableOpacity } from 'react-native';
import type { DifficultySelectorProps } from '../../types';
import { styles } from '../../styles/proof/DifficultySelector.styles';

export default function DifficultySelector({ mode, onModeChange, disabled }: DifficultySelectorProps) {
  const displayMode = mode.charAt(0).toUpperCase() + mode.slice(1);
  
  return (
    <View style={styles.modeContainer}>
      <TouchableOpacity
        style={styles.modeButton}
        onPress={onModeChange}
        activeOpacity={0.7}
        disabled={disabled}
        accessibilityLabel={`Difficulty: ${displayMode}`}
        accessibilityRole="button"
        accessibilityHint="Tap to cycle through difficulty levels"
        accessibilityState={{ disabled }}
      >
        <Text style={styles.modeButtonText}>{displayMode}</Text>
      </TouchableOpacity>
    </View>
  );
}
