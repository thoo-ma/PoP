import { Alert, Button, cn } from 'heroui-native'
import { memo } from 'react'
import { View } from 'react-native'

import { screenError, tactileButton, tactileButtonText } from '@/styles'

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
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={onRetry}
          className={cn(tactileButton({ variant: 'primary' }), 'mt-4')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>Retry</Button.Label>
        </Button>
      )}
    </View>
  )
})
