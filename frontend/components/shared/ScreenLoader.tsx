import { memo } from 'react'
import { Text, View } from 'react-native'
import { Spinner } from '@/components/ui'
import { screenLoader } from '@/layouts'

interface ScreenLoaderProps {
  title?: string
  message?: string
}

export default memo(function ScreenLoader({ title, message }: ScreenLoaderProps) {
  const s = screenLoader()
  return (
    <View className={s.root()}>
      <Spinner size="lg" />
      {title && <Text className={s.title()}>{title}</Text>}
      {message && <Text className={s.message()}>{message}</Text>}
    </View>
  )
})
