import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import {
  infoCard,
  phaseContainer,
  phaseText,
  recordingIndicator,
  tactileButton,
  tactileButtonText,
} from '@/styles'
import type { NFT } from '@/types'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  isRecording: boolean
  isAnalyzing: boolean
  onStop: () => void
  onCancel: () => void
}

export function RecordingPhase({ nft, isRecording, isAnalyzing, onStop, onCancel }: Props) {
  const pt = phaseText()
  const recordStyles = recordingIndicator()
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      {isAnalyzing ? (
        <View className={infoCard()}>
          <Text className={pt.statusText()}>Analyzing audio…</Text>
        </View>
      ) : isRecording ? (
        <View className={infoCard()}>
          <View className={recordStyles.root()}>
            <View className={recordStyles.dot()} />
            <Text className={recordStyles.label()}>Recording…</Text>
          </View>
          <Button
            animation="disable-all"
            variant="ghost"
            feedbackVariant="none"
            onPress={onStop}
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>Stop</Button.Label>
          </Button>
        </View>
      ) : (
        <View className={infoCard()}>
          <Text className={pt.statusText()}>Processing…</Text>
        </View>
      )}
      {!isAnalyzing && (
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={onCancel}
          className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'outline' })}>Cancel</Button.Label>
        </Button>
      )}
    </View>
  )
}
