import { memo } from 'react'
import { Text, View } from 'react-native'
import { Button } from '@/components/ui'
import { phaseContainer, phaseContent, phaseText, timerText } from '@/styles'
import type { NFT } from '@/types'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  countdownValue: number
  onCancel: () => void
}

export const CountdownPhase = memo(function CountdownPhase({
  nft,
  countdownValue,
  onCancel,
}: Props) {
  const pt = phaseText()
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={phaseContent()}>
        <Text className={timerText({ status: 'neutral' })}>{countdownValue}</Text>
        <Text className={pt.hint()}>Get ready…</Text>
      </View>
      <Button animation="disable-all" variant="outline" onPress={onCancel} className="w-full">
        <Button.Label>Cancel</Button.Label>
      </Button>
    </View>
  )
})
