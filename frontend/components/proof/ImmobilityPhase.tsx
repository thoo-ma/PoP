import { Text, View } from 'react-native'
import { Button } from '@/components/ui'
import { phaseContainer, phaseContent, statusBadge, timerText } from '@/styles'
import type { ChallengeStatus, NFT } from '@/types'
import AlertFrame from '../shared/AlertFrame'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  remainingTime: number
  status: ChallengeStatus
  onCancel: () => void
}

export function ImmobilityPhase({ nft, remainingTime, status, onCancel }: Props) {
  const isWarning = status === 'warning'
  const warningBadge = statusBadge({ status: 'warning' })
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={phaseContent()}>
        <Text className={timerText({ status: isWarning ? 'danger' : 'normal' })}>
          {(remainingTime / 1000).toFixed(1)}s
        </Text>
        {isWarning ? (
          <View className={warningBadge.root()}>
            <Text className={warningBadge.label()}>Movement detected!</Text>
          </View>
        ) : (
          <AlertFrame status="success" title="Hold still" />
        )}
      </View>
      <Button animation="disable-all" variant="outline" onPress={onCancel} className="w-full">
        <Button.Label>Cancel</Button.Label>
      </Button>
    </View>
  )
}
