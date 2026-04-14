import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import {
  phaseContainer,
  phaseContent,
  phaseText,
  tactileButton,
  tactileButtonText,
  timerText,
} from '@/styles'
import type { NFT } from '@/types'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  countdownValue: number
  onCancel: () => void
}

export function CountdownPhase({ nft, countdownValue, onCancel }: Props) {
  const pt = phaseText()
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={phaseContent()}>
        <Text className={timerText({ status: 'neutral' })}>{countdownValue}</Text>
        <Text className={pt.hint()}>Get ready…</Text>
      </View>
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
