import { View } from 'react-native'
import { phaseContainer } from '@/styles'
import type { NFT } from '@/types'
import AlertFrame from '../shared/AlertFrame'
import TactileButton from '../shared/TactileButton'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  onStartRecording: () => void
  onCancel: () => void
}

export function PromptPhase({ nft, onStartRecording, onCancel }: Props) {
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <AlertFrame
        status="success"
        title="Immobility confirmed!"
        description="Now record the flush sound"
      >
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
      </AlertFrame>
    </View>
  )
}
