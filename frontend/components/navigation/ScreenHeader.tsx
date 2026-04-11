import { memo } from 'react'
import { Text, View } from 'react-native'
import { screenHeader, screenTitle } from '@/styles'

interface ScreenHeaderProps {
  title: string
}

export default memo(function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className={screenHeader()}>
      <Text className={screenTitle({ spacing: 'sm', color: 'accent' })}>{title}</Text>
    </View>
  )
})
