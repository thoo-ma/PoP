import { Alert } from 'heroui-native'
import { View } from 'react-native'
import { phaseContainer } from '@/styles'
import type { NFT } from '@/types'
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
      <Alert
        status="success"
        className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title className="font-black">Immobility confirmed!</Alert.Title>
          <Alert.Description className="font-bold">Now record the flush sound</Alert.Description>
        </Alert.Content>
      </Alert>
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
