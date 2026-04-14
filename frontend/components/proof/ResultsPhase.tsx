import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import { phaseContainer, resultCard, tactileButton, tactileButtonText } from '@/styles'
import type { DetectionResult, NFT, RateLimitError } from '@/types'
import { formatConfidencePercentage } from '@/utils'
import { ChallengeHeader } from './ChallengeHeader'

type Props = {
  nft: NFT
  rateLimitError: RateLimitError | null
  detectionError: string | null
  detectionResult: DetectionResult | null
  poopedEnergy: { from: number; to: number } | null
  poopedXP: { gained: number; level: number; leveledUp: boolean } | null
  poopedPoop: { earned: number; balance: number } | null
  actionLoading: boolean
  lootRollId: string | null
  onRoulette: () => void
  onReset: () => void
}

export function ResultsPhase({
  nft,
  rateLimitError,
  detectionError,
  detectionResult,
  poopedEnergy,
  poopedXP,
  poopedPoop,
  actionLoading,
  lootRollId,
  onRoulette,
  onReset,
}: Props) {
  if (rateLimitError) {
    const cardStyles = resultCard({ status: 'warning' })
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <View className={cardStyles.root()}>
          <Text className={cardStyles.title()}>Daily limit reached</Text>
          <Text className={cardStyles.detail()}>{rateLimitError.message}</Text>
        </View>
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={onReset}
          className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>Done</Button.Label>
        </Button>
      </View>
    )
  }
  if (detectionError && !detectionResult) {
    const cardStyles = resultCard({ status: 'warning' })
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <View className={cardStyles.root()}>
          <Text className={cardStyles.title()}>Something went wrong</Text>
          <Text className={cardStyles.detail()}>{detectionError}</Text>
        </View>
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={onReset}
          className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>
            Try Again
          </Button.Label>
        </Button>
      </View>
    )
  }
  if (detectionResult && !detectionResult.detected) {
    const cardStyles = resultCard({ status: 'failure' })
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <View className={cardStyles.root()}>
          <Text className={cardStyles.title()}>Flush not detected</Text>
          <Text className={cardStyles.detail()}>
            Confidence: {formatConfidencePercentage(detectionResult.confidence)}
          </Text>
        </View>
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={onReset}
          className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>
            Try Again
          </Button.Label>
        </Button>
      </View>
    )
  }
  // Guard: only render success when flush was explicitly confirmed.
  // Without this check the fallthrough renders "Flush confirmed!" even
  // when detectionResult is still null (e.g. brief transition render
  // before detectionError is committed), causing a visible false-positive flash.
  if (!detectionResult?.detected) return null

  // Success
  const cardStyles = resultCard({ status: 'success' })
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <View className={cardStyles.root()}>
        <Text className={cardStyles.title()}>Flush confirmed!</Text>
        {poopedEnergy && (
          <Text className={cardStyles.detail()}>
            Energy: {poopedEnergy.from} → {poopedEnergy.to}
          </Text>
        )}
        {poopedXP && (
          <>
            <Text className={cardStyles.detail()}>+{poopedXP.gained} XP</Text>
            {poopedXP.leveledUp && (
              <Text className={cardStyles.detail()}>Level Up! Now Lv {poopedXP.level}</Text>
            )}
          </>
        )}
        {poopedPoop && <Text className={cardStyles.detail()}>+{poopedPoop.earned} POOP</Text>}
        {actionLoading && <Text className={cardStyles.detail()}>Saving…</Text>}
      </View>
      {lootRollId ? (
        <Button
          variant="ghost"
          feedbackVariant="none"
          onPress={onRoulette}
          isDisabled={actionLoading}
          className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>
            Continue →
          </Button.Label>
        </Button>
      ) : (
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={onReset}
          className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'primary' })}>Done</Button.Label>
        </Button>
      )}
    </View>
  )
}
