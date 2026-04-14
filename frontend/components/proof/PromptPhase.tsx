import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import { infoCard, phaseContainer, phaseText, tactileButton, tactileButtonText } from '@/styles'
import type { NFT } from '@/types'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  onStartRecording: () => void
  onCancel: () => void
}

export function PromptPhase({ nft, onStartRecording, onCancel }: Props) {
  const pt = phaseText()
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={infoCard()}>
        <Text className={pt.promptTitle()}>Immobility confirmed!</Text>
        <Text className={pt.promptSubtitle()}>Now record the flush sound</Text>
      </View>
      <Button
        animation="disable-all"
        variant="ghost"
        feedbackVariant="none"
        onPress={onStartRecording}
        className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
      >
        <Button.Label className={tactileButtonText({ variant: 'primary' })}>
          Start Recording
        </Button.Label>
      </Button>
      <Button
        animation="disable-all"
        variant="ghost"
        feedbackVariant="none"
        onPress={onCancel}
        className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
      >
        <Button.Label className={tactileButtonText({ variant: 'outline' })}>Cancel</Button.Label>
      </Button>
    </View>
  )
}
