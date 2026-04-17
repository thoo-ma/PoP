import { Alert } from 'heroui-native'
import { Text, View } from 'react-native'
import { phaseContainer, phaseContent, statusBadge, timerText } from '@/styles'
import type { ChallengeStatus, NFT } from '@/types'
import TactileButton from '../shared/TactileButton'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  remainingTime: number
  status: ChallengeStatus
  onCancel: () => void
}

export function ImmobilityPhase({ nft, remainingTime, status, onCancel }: Props) {
  const isWarning = status === 'warning'
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={phaseContent()}>
        <Text className={timerText({ status: isWarning ? 'danger' : 'normal' })}>
          {(remainingTime / 1000).toFixed(1)}s
        </Text>
        {isWarning ? (
          <View className={statusBadge({ status: 'warning' }).root()}>
            <Text className={statusBadge({ status: 'warning' }).label()}>Movement detected!</Text>
          </View>
        ) : (
          <Alert
            status="success"
            className="w-full rounded-2xl border-[3px] border-outline border-b-[5px]"
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title className="font-black">Hold still</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
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
