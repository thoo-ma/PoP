import { Alert } from 'heroui-native'
import { memo } from 'react'
import { View } from 'react-native'
import { screenError } from '@/styles'
import TactileButton from './TactileButton'

interface ScreenErrorProps {
  title: string
  message: string
  onRetry?: () => void
}

export default memo(function ScreenError({ title, message, onRetry }: ScreenErrorProps) {
  return (
    <View className={screenError()}>
      <Alert
        status="danger"
        className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title className="font-black">{title}</Alert.Title>
          <Alert.Description className="font-bold">{message}</Alert.Description>
        </Alert.Content>
      </Alert>
      {onRetry && (
        <TactileButton animation="disable-all" variant="primary" onPress={onRetry} className="mt-4">
          Retry
        </TactileButton>
      )}
    </View>
  )
})
