import { Text, View } from 'react-native'
import { infoCard, phaseContainer, phaseText, recordingIndicator } from '@/styles'
import type { NFT } from '@/types'
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
          <TactileButton
            animation="disable-all"
            variant="primary"
            onPress={onStop}
            className="w-full"
          >
            Stop
          </TactileButton>
        </View>
      ) : (
        <View className={infoCard()}>
          <Text className={pt.statusText()}>Processing…</Text>
        </View>
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
