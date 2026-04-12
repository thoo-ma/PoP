import { memo } from 'react'
import { Text, View } from 'react-native'
import { screenTitle } from '@/styles'

interface ScreenHeaderProps {
  title: string
}

const SCREEN_TITLES: Record<string, string> = {
  Poop: 'Poop',
  Vault: 'Vault',
  Breed: 'Breed',
  Repair: 'Repair',
  Profile: 'Profile',
}

export default memo(function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="h-12 items-center justify-center bg-surface">
      <Text className={screenTitle({ spacing: 'sm' })}>{SCREEN_TITLES[title] ?? title}</Text>
    </View>
  )
})
