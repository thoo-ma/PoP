import { Text, View } from 'react-native'
import { phaseContainer, phaseContent, phaseText, timerText } from '@/styles'
import type { NFT } from '@/types'
import TactileButton from '../shared/TactileButton'
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
      <TactileButton
        animation="disable-all"
        variant="outline"
        onPress={onCancel}
        className="w-full"
      >
        Cancel
      </TactileButton>
    </View>
  )
}
