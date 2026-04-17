import { memo } from 'react'
import { View } from 'react-native'
import { screenInfo } from '@/styles'
import AlertBox from './AlertBox'

interface ScreenInfoProps {
  title: string
  message: string
}

export default memo(function ScreenInfo({ title, message }: ScreenInfoProps) {
  return (
    <View className={screenInfo()}>
      <AlertBox status="default" title={title} description={message} />
    </View>
  )
})
