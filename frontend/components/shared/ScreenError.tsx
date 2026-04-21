import { memo } from 'react'
import { View } from 'react-native'
import { screenError } from '@/styles'
import AlertFrame from './AlertFrame'
import TactileButton from './TactileButton'

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
          <TactileButton
            animation="disable-all"
            variant="primary"
            onPress={onRetry}
            className="mt-4"
          >
            Retry
          </TactileButton>
        )}
      </AlertFrame>
    </View>
  )
})
