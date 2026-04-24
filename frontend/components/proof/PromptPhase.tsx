import { View } from 'react-native'
import { Button } from '@/components/ui'
import { phaseContainer } from '@/layouts'
import type { NFT } from '@/types'
import AlertFrame from '../shared/AlertFrame'
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
        <Button
          animation="disable-all"
          variant="primary"
          onPress={onStartRecording}
          className="w-full"
        >
          <Button.Label>Start Recording</Button.Label>
        </Button>
        <Button animation="disable-all" variant="outline" onPress={onCancel} className="w-full">
          <Button.Label>Cancel</Button.Label>
        </Button>
      </AlertFrame>
    </View>
  )
}
