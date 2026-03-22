import { memo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants';
import { Button } from 'heroui-native';

interface ProfileButtonProps {
  /** Called when the user taps the profile icon button. */
  onPress: () => void;
}

/**
 * Floating profile icon button rendered in the navigation bar.
 * Tapping it opens the Profile modal.
 */
export default memo(function ProfileButton({ onPress }: ProfileButtonProps) {
  return (
    <Button
      isIconOnly
      variant="ghost"
      onPress={onPress}
      style={{ position: 'absolute', top: 60, left: 20, zIndex: 100, padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
      accessibilityLabel="Profile"
      accessibilityHint="Opens your profile and settings"
    >
      <MaterialIcons name="account-circle" size={32} color={colors.primary} />
    </Button>
  );
});
