import { memo } from 'react'
import { Text, View } from 'react-native'
import { screenTitle } from '@/styles'

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
    <View className="absolute top-15 left-0 right-0 z-99 h-12 items-center justify-center pointer-events-none">
      <Text className={screenTitle({ spacing: 'sm' })}>{SCREEN_TITLES[title] ?? title}</Text>
    </View>
  )
})
