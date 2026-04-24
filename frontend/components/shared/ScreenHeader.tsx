import { memo } from 'react'
import { Text, View } from 'react-native'
import { screenHeader, screenTitle } from '@/styles'

interface ScreenHeaderProps {
  title: string
}

const SCREEN_TITLES: Record<string, string> = {
  Poop: 'Home',
  Vault: 'Vault',
  Breed: 'Breed',
  Repair: 'Repair',
  Profile: 'Profile',
}

export default memo(function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className={screenHeader()}>
      <Text className={screenTitle({ spacing: 'sm' })} accessibilityRole="header">
        {SCREEN_TITLES[title] ?? title}
      </Text>
    </View>
  )
})
