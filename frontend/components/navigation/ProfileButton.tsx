import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants';
import { styles } from '@/styles/navigation/ProfileButton.styles';

interface ProfileButtonProps {
  onPress: () => void;
}

export default memo(function ProfileButton({ onPress }: ProfileButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel="Profile"
      accessibilityRole="button"
      accessibilityHint="Opens your profile and settings"
    >
      <MaterialIcons name="account-circle" size={32} color={colors.primary} />
    </TouchableOpacity>
  );
});
