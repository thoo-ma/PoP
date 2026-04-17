import { Alert } from 'heroui-native'
import { View } from 'react-native'
import { phaseContainer } from '@/styles'
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
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      {isAnalyzing ? (
        <Alert
          status="success"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="font-black">Analyzing audio…</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : isRecording ? (
        <Alert
          status="success"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="font-black">Recording…</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : (
        <Alert
          status="success"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="font-black">Processing…</Alert.Title>
          </Alert.Content>
        </Alert>
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
