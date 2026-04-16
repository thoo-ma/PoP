import { Text, View } from 'react-native'
import { infoCard, phaseContainer, phaseText } from '@/styles'
import type { NFT } from '@/types'
import TactileButton from '../shared/TactileButton'
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
      <TactileButton
        animation="disable-all"
        variant="primary"
        onPress={onStartRecording}
        className="w-full"
      >
        Start Recording
      </TactileButton>
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
