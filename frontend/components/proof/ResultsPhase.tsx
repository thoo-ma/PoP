import { View } from 'react-native'
import { Button } from '@/components/ui'
import { phaseContainer } from '@/layouts'
import type { DetectionResult, NFT, RateLimitError } from '@/types'
import AlertFrame from '../shared/AlertFrame'
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
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <AlertFrame
          status="warning"
          title="Daily limit reached"
          description={rateLimitError.message}
          className="mb-4"
        >
          <Button animation="disable-all" variant="primary" onPress={onReset} className="w-full">
            <Button.Label>Done</Button.Label>
          </Button>
        </AlertFrame>
      </View>
    )
  }
  if (detectionError && !detectionResult) {
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <AlertFrame
          status="danger"
          title="Something went wrong"
          description={detectionError}
          className="mb-4"
        >
          <Button animation="disable-all" variant="primary" onPress={onReset} className="w-full">
            <Button.Label>Try Again</Button.Label>
          </Button>
        </AlertFrame>
      </View>
    )
  }
  if (detectionResult && !detectionResult.detected) {
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <AlertFrame
          status="danger"
          title="Flush not detected"
          description={`Confidence: ${Math.round(detectionResult.confidence * 100)}%`}
          className="mb-4"
        >
          <Button animation="disable-all" variant="primary" onPress={onReset} className="w-full">
            <Button.Label>Try Again</Button.Label>
          </Button>
        </AlertFrame>
      </View>
    )
  }
  // Guard: only render success when flush was explicitly confirmed.
  // Without this check the fallthrough renders "Flush confirmed!" even
  // when detectionResult is still null (e.g. brief transition render
  // before detectionError is committed), causing a visible false-positive flash.
  if (!detectionResult?.detected) return null

  // Success
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <AlertFrame
        status="success"
        title="Flush confirmed!"
        description={[
          poopedEnergy && `Energy: ${poopedEnergy.from} → ${poopedEnergy.to}`,
          poopedXP && `+${poopedXP.gained} XP`,
          poopedXP?.leveledUp && `Level Up! Now Lv ${poopedXP.level}`,
          poopedPoop && `+${poopedPoop.earned} POOP`,
          actionLoading && 'Saving…',
        ]}
        className="mb-4"
      >
        {lootRollId ? (
          <Button
            variant="primary"
            onPress={onRoulette}
            isDisabled={actionLoading}
            className="w-full"
          >
            <Button.Label>Continue →</Button.Label>
          </Button>
        ) : (
          <Button animation="disable-all" variant="primary" onPress={onReset} className="w-full">
            <Button.Label>Done</Button.Label>
          </Button>
        )}
      </AlertFrame>
    </View>
  )
}
