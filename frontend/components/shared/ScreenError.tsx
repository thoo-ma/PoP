import { memo } from 'react'
import { View } from 'react-native'
import { Button } from '@/components/ui'
import { screenError } from '@/styles'
import AlertFrame from './AlertFrame'

interface ScreenErrorProps {
  title: string
  message: string
  onRetry?: () => void
}

export default memo(function ScreenError({ title, message, onRetry }: ScreenErrorProps) {
  return (
    <View className={screenError()}>
      <AlertFrame status="danger" title={title} description={message}>
        {onRetry && (
          <Button animation="disable-all" variant="primary" onPress={onRetry} className="mt-4">
            <Button.Label>Retry</Button.Label>
          </Button>
        )}
      </AlertFrame>
    </View>
  )
})
