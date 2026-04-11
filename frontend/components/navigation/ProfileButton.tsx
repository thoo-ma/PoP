import { MaterialIcons } from '@expo/vector-icons'
import { Button } from 'heroui-native'
import { memo } from 'react'
import { colors } from '@/constants'
import { floatingNavButton } from '@/styles'

interface ProfileButtonProps {
  /** Called when the user taps the profile icon button. */
  onPress: () => void
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
      feedbackVariant="none"
      onPress={onPress}
      className={floatingNavButton({ side: 'left' })}
      accessibilityLabel="Profile"
      accessibilityHint="Opens your profile and settings"
    >
      <MaterialIcons name="account-circle" size={32} color={colors.primary} />
    </Button>
  )
})
