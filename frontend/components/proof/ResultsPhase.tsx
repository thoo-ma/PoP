import { Text, View } from 'react-native'
import { phaseContainer, resultCard } from '@/styles'
import type { DetectionResult, NFT, RateLimitError } from '@/types'
import { formatConfidencePercentage } from '@/utils'
import TactileButton from '../shared/TactileButton'
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
        <TactileButton
          animation="disable-all"
          variant="primary"
          onPress={onReset}
          className="w-full"
        >
          Done
        </TactileButton>
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
        <TactileButton
          animation="disable-all"
          variant="primary"
          onPress={onReset}
          className="w-full"
        >
          Try Again
        </TactileButton>
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
        <TactileButton
          animation="disable-all"
          variant="primary"
          onPress={onReset}
          className="w-full"
        >
          Try Again
        </TactileButton>
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
        <TactileButton
          variant="primary"
          onPress={onRoulette}
          isDisabled={actionLoading}
          className="w-full"
        >
          Continue →
        </TactileButton>
      ) : (
        <TactileButton
          animation="disable-all"
          variant="primary"
          onPress={onReset}
          className="w-full"
        >
          Done
        </TactileButton>
      )}
    </View>
  )
}
