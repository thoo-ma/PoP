import { memo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants";
import { Button } from "heroui-native";

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
      className="absolute top-[60px] left-5 z-[100] p-2 bg-[rgba(255,255,255,0.9)] rounded-[20px] shadow-md"
      accessibilityLabel="Profile"
      accessibilityHint="Opens your profile and settings"
    >
      <MaterialIcons name="account-circle" size={32} color={colors.primary} />
    </Button>
  );
});
