import { View } from 'react-native'
import { phaseContainer } from '@/styles'
import type { NFT } from '@/types'
import AlertBox from '../shared/AlertBox'
import TactileButton from '../shared/TactileButton'
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
        <AlertBox status="success" title="Analyzing audio…" />
      ) : isRecording ? (
        <AlertBox status="success" title="Recording…" />
      ) : (
        <AlertBox status="success" title="Processing…" />
      )}
      {isRecording && (
        <TactileButton
          animation="disable-all"
          variant="primary"
          onPress={onStop}
          className="w-full"
        >
          Stop
        </TactileButton>
      )}
      {!isAnalyzing && (
        <TactileButton
          animation="disable-all"
          variant="outline"
          onPress={onCancel}
          className="w-full"
        >
          Cancel
        </TactileButton>
      )}
    </View>
  )
}
