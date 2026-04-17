import { Alert } from 'heroui-native'
import { View } from 'react-native'
import { phaseContainer } from '@/styles'
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
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <Alert
          status="warning"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px] mb-4"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="font-black">Daily limit reached</Alert.Title>
            <Alert.Description className="font-bold">{rateLimitError.message}</Alert.Description>
          </Alert.Content>
        </Alert>
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
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <Alert
          status="danger"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px] mb-4"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="font-black">Something went wrong</Alert.Title>
            <Alert.Description className="font-bold">{detectionError}</Alert.Description>
          </Alert.Content>
        </Alert>
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
    return (
      <View className={phaseContainer()}>
        <ChallengeHeader nft={nft} />
        <Alert
          status="danger"
          className="w-full rounded-2xl border-[3px] border-outline border-b-[5px] mb-4"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="font-black">Flush not detected</Alert.Title>
            <Alert.Description className="font-bold">
              Confidence: {formatConfidencePercentage(detectionResult.confidence)}
            </Alert.Description>
          </Alert.Content>
        </Alert>
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
  return (
    <View className={phaseContainer()}>
      <ChallengeHeader nft={nft} />
      <Alert
        status="success"
        className="w-full rounded-2xl border-[3px] border-outline border-b-[5px] mb-4"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title className="font-black">Flush confirmed!</Alert.Title>
          {poopedEnergy && (
            <Alert.Description className="font-bold">
              Energy: {poopedEnergy.from} → {poopedEnergy.to}
            </Alert.Description>
          )}
          {poopedXP && (
            <>
              <Alert.Description className="font-bold">+{poopedXP.gained} XP</Alert.Description>
              {poopedXP.leveledUp && (
                <Alert.Description className="font-bold">
                  Level Up! Now Lv {poopedXP.level}
                </Alert.Description>
              )}
            </>
          )}
          {poopedPoop && (
            <Alert.Description className="font-bold">+{poopedPoop.earned} POOP</Alert.Description>
          )}
          {actionLoading && <Alert.Description className="font-bold">Saving…</Alert.Description>}
        </Alert.Content>
      </Alert>
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
