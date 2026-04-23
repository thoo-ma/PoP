import { View } from 'react-native'
import { Button } from '@/components/ui'
import { phaseContainer } from '@/styles'
import type { NFT } from '@/types'
import AlertFrame from '../shared/AlertFrame'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  isRecording: boolean
  isAnalyzing: boolean
  onStop: () => void
  onCancel: () => void
}

export function RecordingPhase({ nft, isRecording, isAnalyzing, onStop, onCancel }: Props) {
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      {isAnalyzing ? (
        <AlertFrame status="success" title="Analyzing audio…" />
      ) : isRecording ? (
        <AlertFrame status="success" title="Recording…" />
      ) : (
        <AlertFrame status="success" title="Processing…" />
      )}
      {isRecording && (
        <Button animation="disable-all" variant="primary" onPress={onStop} className="w-full">
          <Button.Label>Stop</Button.Label>
        </Button>
      )}
      {!isAnalyzing && (
        <Button animation="disable-all" variant="outline" onPress={onCancel} className="w-full">
          <Button.Label>Cancel</Button.Label>
        </Button>
      )}
    </View>
  )
}
