import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import {
  phaseContainer,
  phaseContent,
  statusBadge,
  tactileButton,
  tactileButtonText,
  timerText,
} from '@/styles'
import type { ChallengeStatus, NFT } from '@/types'
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
      <Button
        animation="disable-all"
        variant="ghost"
        feedbackVariant="none"
        onPress={onCancel}
        className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
      >
        <Button.Label className={tactileButtonText({ variant: 'outline' })}>Cancel</Button.Label>
      </Button>
    </View>
  )
}
