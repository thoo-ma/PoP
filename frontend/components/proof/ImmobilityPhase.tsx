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
  const badgeStyles = statusBadge({ status: isWarning ? 'warning' : 'ok' })
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={phaseContent()}>
        <Text className={timerText({ status: isWarning ? 'danger' : 'normal' })}>
          {(remainingTime / 1000).toFixed(1)}s
        </Text>
        <View className={badgeStyles.root()}>
          <Text className={badgeStyles.label()}>
            {isWarning ? 'Movement detected!' : 'Hold still'}
          </Text>
        </View>
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
