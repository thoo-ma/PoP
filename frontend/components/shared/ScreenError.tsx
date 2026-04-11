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
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
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
