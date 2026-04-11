import { Spinner } from 'heroui-native'
import { memo } from 'react'
import { Text, View } from 'react-native'
import { screenLoader } from '@/styles'

interface ScreenLoaderProps {
  title?: string
  message?: string
}

export default memo(function ScreenLoader({ message }: ScreenLoaderProps) {
  const s = screenLoader()
  return (
    <View className={s.root()}>
      <Spinner size="lg" />
      {message && <Text className={s.message()}>{message}</Text>}
    </View>
  )
})
