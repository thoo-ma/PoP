import { Alert } from 'heroui-native'
import { memo } from 'react'
import { View } from 'react-native'
import { screenInfo } from '@/styles'

interface ScreenInfoProps {
  title: string
  message: string
}

export default memo(function ScreenInfo({ title, message }: ScreenInfoProps) {
  return (
    <View className={screenInfo()}>
      <Alert
        status="default"
        className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title className="font-black">{title}</Alert.Title>
          <Alert.Description className="font-bold">{message}</Alert.Description>
        </Alert.Content>
      </Alert>
    </View>
  )
})
