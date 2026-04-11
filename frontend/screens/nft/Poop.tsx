import { getThresholdForDifficulty } from '@pop/shared/sensors'
import { LinearGradient } from 'expo-linear-gradient'
import { Button, cn, Dialog, ScrollShadow } from 'heroui-native'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import {
  LootRouletteCard,
  NFTProperties,
  NFTSelector,
  ScreenError,
  ScreenLoader,
  StatAllocationModal,
} from '@/components'
import { getCooldownStatus } from '@/constants'
import type { AllocateResult } from '@/hooks'
import { useImmobilityChallenge, usePoopNFT, useToiletDetection, useUserNFTs } from '@/hooks'
import {
  badgeLabel,
  challengeHeader,
  dialogBody,
  dialogFooter,
  infoCard,
  nftDetailCard,
  nftPickerButton,
  nftPickerPlaceholder,
  overlayBadge,
  phaseContainer,
  phaseContent,
  phaseText,
  recordingIndicator,
  resultCard,
  scrollContent,
  statusBadge,
  tactileButton,
  tactileButtonText,
  timerText,
  toastBanner,
  typeBadge,
} from '@/styles'
import type { NFT } from '@/types'
import { formatConfidencePercentage, formatDisplayName } from '@/utils'

const IMMOBILITY_MS_BY_TYPE: Record<NFT['type'], number> = {
  'turbo-flush': 5_000,
  'cruise-seat': 10_000,
  'zen-fortress': 15_000,
}
const GAME_THRESHOLD = getThresholdForDifficulty('normal') // 0.7

type GamePhase =
  | 'idle'
  | 'countdown'
  | 'immobility'
  | 'prompt'
  | 'recording'
  | 'results'
  | 'roulette'

/**
 * Poop screen — the core gameplay loop of the app.
 *
 * Walks the user through five sequential phases:
 * 1. **Idle** — select an NFT and tap Start
 * 2. **Countdown** — brief ready timer
 * 3. **Immobility** — sensor challenge requiring the user to stay still
 * 4. **Prompt** — instruction to record the toilet flush
 * 5. **Recording / Results** — audio capture, YAMNet analysis, and XP award
 *
 * All game logic (energy drain, XP gain, cooldown) runs server-side in
 * the `use-nft` Edge Function via `usePoopNFT`.
 */
export default memo(function Poop() {
  // ── NFT data ──────────────────────────────────────────────
  const { nfts, loading, error, refetch } = useUserNFTs()
  const { poopNFT, loading: actionLoading, cooldownError } = usePoopNFT()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [poopedEnergy, setPoopedEnergy] = useState<{ from: number; to: number } | null>(null)
  const [poopedXP, setPoopedXP] = useState<{
    gained: number
    level: number
    leveledUp: boolean
  } | null>(null)
  const [poopedPoop, setPoopedPoop] = useState<{ earned: number; balance: number } | null>(null)
  const [statModalData, setStatModalData] = useState<{ nft: NFT; points: number } | null>(null)
  const [lootRollId, setLootRollId] = useState<string | null>(null)
  const hasPoopedRef = useRef(false) // guard — call poopNFT exactly once per challenge

  // ── Alert dialog state ─────────────────────────────────────
  const [alertDialog, setAlertDialog] = useState<{ title: string; message: string } | null>(null)

  // Tick once/s so the cooldown countdown refreshes in the UI
  const [, setTick] = useState(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), 1000)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  // ── Challenge state ────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [countdownValue, setCountdownValue] = useState(3)
  const [gameImmobilityMs, setGameImmobilityMs] = useState(10_000) // set at challenge start
  const [frozenRemainingTime, setFrozenRemainingTime] = useState<number | null>(null)
  const [immobilityMessage, setImmobilityMessage] = useState<string | null>(null)

  // ── Proof hooks ────────────────────────────────────────────
  const { elapsedTime, status, isRunning, startChallenge, stopChallenge } =
    useImmobilityChallenge('normal')

  const {
    isRecording,
    audioUri,
    detectionResult,
    isAnalyzing,
    error: detectionError,
    rateLimitError,
    startRecording,
    stopRecording,
    analyzeAudio,
    clearResult,
  } = useToiletDetection()

  // ── Derived ────────────────────────────────────────────────
  const displayNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null
  const remainingTime =
    frozenRemainingTime !== null ? frozenRemainingTime : Math.max(0, gameImmobilityMs - elapsedTime)

  // ── NFT carousel (disabled during challenge) ───────────────
  // Reset selectedIndex when a background refetch shrinks the nfts array past it,
  // preventing stale non-null assertions from causing a runtime throw.
  useEffect(() => {
    if (selectedIndex !== null && nfts[selectedIndex] === undefined) {
      setSelectedIndex(null)
    }
  }, [nfts, selectedIndex])

  const handleSelectNFT = () => {
    if (nfts.length === 0) return
    const ready = nfts.findIndex((n) => n.energy > 0 && !getCooldownStatus(n).isOnCooldown)
    const withEnergy = nfts.findIndex((n) => n.energy > 0)
    setSelectedIndex(ready >= 0 ? ready : withEnergy >= 0 ? withEnergy : 0)
  }

  const handlePrev = useCallback(() => {
    if (phase !== 'idle') return
    setSelectedIndex((i) => ((i as number) - 1 + nfts.length) % nfts.length)
    setPoopedEnergy(null)
    setPoopedXP(null)
    setPoopedPoop(null)
    setStatModalData(null)
  }, [nfts.length, phase])

  const handleNext = useCallback(() => {
    if (phase !== 'idle') return
    setSelectedIndex((i) => ((i as number) + 1) % nfts.length)
    setPoopedEnergy(null)
    setPoopedXP(null)
    setPoopedPoop(null)
    setStatModalData(null)
  }, [nfts.length, phase])

  // ── Tap Poop: guards → begin 3-2-1 ────────────────────────
  const handlePoop = () => {
    if (!displayNFT) return
    if (displayNFT.energy <= 0) {
      setAlertDialog({
        title: 'No Energy',
        message: 'This NFT has no energy left. Visit the Repair screen to restore energy.',
      })
      return
    }
    const cooldown = getCooldownStatus(displayNFT)
    if (cooldown.isOnCooldown) {
      setAlertDialog({
        title: 'On Cooldown',
        message: `This NFT is resting. Ready in ${cooldown.display}.`,
      })
      return
    }
    hasPoopedRef.current = false
    setCountdownValue(3)
    setGameImmobilityMs(IMMOBILITY_MS_BY_TYPE[displayNFT.type] ?? 10_000)
    setPhase('countdown')
  }

  // ── 3-2-1 countdown ───────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return
    const id = setInterval(() => {
      setCountdownValue((v) => {
        if (v <= 1) {
          clearInterval(id)
          setFrozenRemainingTime(null)
          startChallenge()
          setPhase('immobility')
          return 1
        }
        return v - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, startChallenge])

  // ── Immobility phase monitor ───────────────────────────────
  useEffect(() => {
    if (phase !== 'immobility') return

    if (status === 'warning' && frozenRemainingTime === null) {
      setFrozenRemainingTime(Math.max(0, gameImmobilityMs - elapsedTime))
    }
    if (status === 'running' && frozenRemainingTime !== null) {
      setFrozenRemainingTime(null)
    }
    if (elapsedTime >= gameImmobilityMs && status === 'running') {
      stopChallenge()
      setPhase('prompt')
      return
    }
    // Hook reset challenge (grace period expired): isRunning=false, status='idle', elapsedTime=0
    if (!isRunning && status === 'idle' && elapsedTime === 0) {
      setFrozenRemainingTime(null)
      setImmobilityMessage('Too much movement — try again!')
      setPhase('idle')
    }
  }, [phase, elapsedTime, status, isRunning, frozenRemainingTime, stopChallenge, gameImmobilityMs])

  // Auto-clear the toast after 3 s
  useEffect(() => {
    if (!immobilityMessage) return
    const id = setTimeout(() => setImmobilityMessage(null), 3000)
    return () => clearTimeout(id)
  }, [immobilityMessage])

  // ── Cancel helpers ─────────────────────────────────────────
  const handleCancelCountdownOrImmobility = () => {
    stopChallenge()
    setFrozenRemainingTime(null)
    setPhase('idle')
  }
  const handleCancelPrompt = () => setPhase('idle')
  const handleCancelRecording = () => {
    clearResult()
    setPhase('idle')
  }

  // ── Prompt → recording ────────────────────────────────────
  const handleStartRecording = () => {
    setPhase('recording')
    startRecording()
  }

  // Auto-analyze once audioUri is available
  useEffect(() => {
    if (phase === 'recording' && audioUri && !isAnalyzing && !detectionResult) {
      analyzeAudio(GAME_THRESHOLD)
    }
  }, [phase, audioUri, isAnalyzing, detectionResult, analyzeAudio])

  // Transition to results
  useEffect(() => {
    if (
      phase === 'recording' &&
      (detectionResult || rateLimitError || (detectionError && !isAnalyzing))
    ) {
      setPhase('results')
    }
  }, [phase, detectionResult, rateLimitError, detectionError, isAnalyzing])

  // ── Master reset ──────────────────────────────────────────
  const handleFullReset = useCallback(() => {
    clearResult()
    hasPoopedRef.current = false
    setPoopedEnergy(null)
    setPoopedXP(null)
    setPoopedPoop(null)
    setStatModalData(null)
    setLootRollId(null)
    setFrozenRemainingTime(null)
    setImmobilityMessage(null)
    setPhase('idle')
  }, [clearResult])

  // ── Grant XP on confirmed flush ───────────────────────────
  useEffect(() => {
    if (phase !== 'results') return
    if (hasPoopedRef.current) return
    if (!detectionResult?.detected) return
    if (!displayNFT) return

    hasPoopedRef.current = true
    ;(async () => {
      const result = await poopNFT(displayNFT.id)
      if (result) {
        setPoopedEnergy({ from: displayNFT.energy, to: result.energy })
        setPoopedXP({
          gained: result.xp_gained,
          level: result.level,
          leveledUp: result.leveled_up,
        })
        setPoopedPoop({ earned: result.poop_earned, balance: result.poop_balance })
        setLootRollId(result.loot_roll_id ?? null)
        if (result.leveled_up && result.stat_points > 0) {
          setStatModalData({
            nft: { ...displayNFT, stat_points: result.stat_points },
            points: result.stat_points,
          })
        }
      } else if (cooldownError) {
        const rem = cooldownError.cooldown_remaining_seconds
        const h = Math.floor(rem / 3600)
        const m = Math.floor((rem % 3600) / 60)
        const disp = h > 0 ? `${h}h ${m}m` : `${m}m`
        setAlertDialog({ title: 'On Cooldown', message: `This NFT is resting. Ready in ${disp}.` })
        handleFullReset()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, detectionResult, cooldownError, displayNFT, handleFullReset, poopNFT])

  // ── Stat allocation ───────────────────────────────────────
  const handleStatAllocated = useCallback((_result: AllocateResult) => {
    setStatModalData(null)
  }, [])
  const handleStatModalDismiss = useCallback(() => setStatModalData(null), [])

  // ── Early returns ─────────────────────────────────────────
  if (loading) return <ScreenLoader title="Poop" message="Loading your collection..." />
  if (error) return <ScreenError title="Poop" message={`Error: ${error}`} onRetry={refetch} />

  // ═════════════════════════════════════════════════════════
  // RENDERERS
  // ═════════════════════════════════════════════════════════

  const renderChallengeHeader = () => {
    if (!displayNFT) return null
    const headerStyles = challengeHeader()
    return (
      <View className={headerStyles.root()}>
        <Image
          source={{ uri: displayNFT.image_url }}
          className={headerStyles.avatar()}
          resizeMode="cover"
        />
        <View className={headerStyles.info()}>
          <Text className={headerStyles.name()}>{formatDisplayName(displayNFT.name)}</Text>
          <Text className={headerStyles.subtitle()}>
            Lv {displayNFT.level} · {displayNFT.type}
          </Text>
        </View>
      </View>
    )
  }

  const renderCountdownPhase = () => (
    <View className={phaseContainer()}>
      {renderChallengeHeader()}
      <View className={phaseContent()}>
        <Text className={timerText({ status: 'neutral' })}>{countdownValue}</Text>
        <Text className={pt.hint()}>Get ready…</Text>
      </View>
      <Button
        animation="disable-all"
        variant="ghost"
        feedbackVariant="none"
        onPress={handleCancelCountdownOrImmobility}
        className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
      >
        <Button.Label className={tactileButtonText({ variant: 'outline' })}>Cancel</Button.Label>
      </Button>
    </View>
  )

  const renderImmobilityPhase = () => {
    const isWarning = status === 'warning'
    const badgeStyles = statusBadge({ status: isWarning ? 'warning' : 'ok' })
    return (
      <View className={phaseContainer()}>
        {renderChallengeHeader()}
        <View className={phaseContent()}>
          <Text className={timerText({ status: isWarning ? 'danger' : 'normal' })}>
            {(remainingTime / 1000).toFixed(1)}s
          </Text>
          <View className={badgeStyles.root()}>
            <Text className={badgeStyles.label()}>
              {isWarning ? '🔴 Movement detected!' : '🟢 Hold still'}
            </Text>
          </View>
        </View>
        <Button
          animation="disable-all"
          variant="ghost"
          feedbackVariant="none"
          onPress={handleCancelCountdownOrImmobility}
          className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
        >
          <Button.Label className={tactileButtonText({ variant: 'outline' })}>Cancel</Button.Label>
        </Button>
      </View>
    )
  }

  const renderPromptPhase = () => (
    <View className={phaseContainer()}>
      {renderChallengeHeader()}
      <View className={infoCard()}>
        <Text className={pt.promptTitle()}>✓ Immobility confirmed!</Text>
        <Text className={pt.promptSubtitle()}>Now record the flush sound</Text>
      </View>
      <Button
        animation="disable-all"
        variant="ghost"
        feedbackVariant="none"
        onPress={handleStartRecording}
        className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
      >
        <Button.Label className={tactileButtonText({ variant: 'primary' })}>
          Start Recording
        </Button.Label>
      </Button>
      <Button
        animation="disable-all"
        variant="ghost"
        feedbackVariant="none"
        onPress={handleCancelPrompt}
        className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
      >
        <Button.Label className={tactileButtonText({ variant: 'outline' })}>Cancel</Button.Label>
      </Button>
    </View>
  )

  const renderRecordingPhase = () => {
    const recordStyles = recordingIndicator()
    return (
      <View className={phaseContainer()}>
        {renderChallengeHeader()}
        {isAnalyzing ? (
          <View className={infoCard()}>
            <Text className={pt.statusText()}>🔍 Analyzing audio…</Text>
          </View>
        ) : isRecording ? (
          <View className={infoCard()}>
            <View className={recordStyles.root()}>
              <View className={recordStyles.dot()} />
              <Text className={recordStyles.label()}>Recording…</Text>
            </View>
            <Button
              animation="disable-all"
              variant="ghost"
              feedbackVariant="none"
              onPress={stopRecording}
              className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                Stop
              </Button.Label>
            </Button>
          </View>
        ) : (
          <View className={infoCard()}>
            <Text className={pt.statusText()}>Processing…</Text>
          </View>
        )}
        {!isAnalyzing && (
          <Button
            animation="disable-all"
            variant="ghost"
            feedbackVariant="none"
            onPress={handleCancelRecording}
            className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'outline' })}>
              Cancel
            </Button.Label>
          </Button>
        )}
      </View>
    )
  }

  const renderResultsPhase = () => {
    if (rateLimitError) {
      const cardStyles = resultCard({ status: 'warning' })
      return (
        <View className={phaseContainer()}>
          {renderChallengeHeader()}
          <View className={cardStyles.root()}>
            <Text className={cardStyles.title()}>Daily limit reached</Text>
            <Text className={cardStyles.detail()}>{rateLimitError.message}</Text>
          </View>
          <Button
            animation="disable-all"
            variant="ghost"
            feedbackVariant="none"
            onPress={handleFullReset}
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
          {renderChallengeHeader()}
          <View className={cardStyles.root()}>
            <Text className={cardStyles.title()}>Something went wrong</Text>
            <Text className={cardStyles.detail()}>{detectionError}</Text>
          </View>
          <Button
            animation="disable-all"
            variant="ghost"
            feedbackVariant="none"
            onPress={handleFullReset}
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
          {renderChallengeHeader()}
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
            onPress={handleFullReset}
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>
              Try Again
            </Button.Label>
          </Button>
        </View>
      )
    }
    // Success
    const cardStyles = resultCard({ status: 'success' })
    return (
      <View className={phaseContainer()}>
        {renderChallengeHeader()}
        <View className={cardStyles.root()}>
          <Text className={cardStyles.title()}>💧 Flush confirmed!</Text>
          {poopedEnergy && (
            <Text className={cardStyles.detail()}>
              Energy: {poopedEnergy.from} → {poopedEnergy.to}
            </Text>
          )}
          {poopedXP && (
            <>
              <Text className={cardStyles.detail()}>+{poopedXP.gained} XP</Text>
              {poopedXP.leveledUp && (
                <Text className={cardStyles.detail()}>🎉 Level Up! Now Lv {poopedXP.level}</Text>
              )}
            </>
          )}
          {poopedPoop && <Text className={cardStyles.detail()}>+{poopedPoop.earned} 💩 POOP</Text>}
          {actionLoading && <Text className={cardStyles.detail()}>Saving…</Text>}
        </View>
        {lootRollId ? (
          <Button
            variant="ghost"
            feedbackVariant="none"
            onPress={() => setPhase('roulette')}
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
            onPress={handleFullReset}
            className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
          >
            <Button.Label className={tactileButtonText({ variant: 'primary' })}>Done</Button.Label>
          </Button>
        )}
      </View>
    )
  }

  const renderRoulettePhase = () => {
    if (!lootRollId) {
      // Fallback: no pending roll (e.g. edge function failed to upsert)
      handleFullReset()
      return null
    }
    return (
      <View className={phaseContainer()}>
        {renderChallengeHeader()}
        <LootRouletteCard lootRollId={lootRollId} onDone={handleFullReset} />
      </View>
    )
  }

  // ═════════════════════════════════════════════════════════
  // IDLE SCREEN
  // ═════════════════════════════════════════════════════════
  const cooldown = displayNFT ? getCooldownStatus(displayNFT) : null
  const onCooldown = cooldown?.isOnCooldown ?? false
  const noEnergy = displayNFT ? displayNFT.energy <= 0 : false
  const buttonDisabled = actionLoading || noEnergy || onCooldown || selectedIndex === null
  const buttonLabel = actionLoading
    ? 'Processing...'
    : noEnergy
      ? 'No Energy'
      : onCooldown
        ? `Ready in ${cooldown?.display}`
        : selectedIndex === null
          ? 'Select an NFT'
          : 'Poop'

  const toastStyles = toastBanner()
  const detailStyles = nftDetailCard()
  const ph = nftPickerPlaceholder()

  const pt = phaseText()

  return (
    <>
      {phase !== 'idle' ? (
        // ── Active challenge ───────────────────────────────
        <ScrollShadow LinearGradientComponent={LinearGradient} className="flex-1">
          <ScrollView
            className="bg-background"
            contentContainerClassName={cn(
              scrollContent({ padding: 'md', bottomPad: 'lg' }),
              'flex-grow items-center pt-[100px]',
            )}
            showsVerticalScrollIndicator={false}
          >
            {phase === 'countdown' && renderCountdownPhase()}
            {phase === 'immobility' && renderImmobilityPhase()}
            {phase === 'prompt' && renderPromptPhase()}
            {phase === 'recording' && renderRecordingPhase()}
            {phase === 'results' && renderResultsPhase()}
            {phase === 'roulette' && renderRoulettePhase()}
          </ScrollView>
        </ScrollShadow>
      ) : (
        // ── Idle (home) ────────────────────────────────────
        <ScrollShadow LinearGradientComponent={LinearGradient} className="flex-1">
          <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName={cn(
              scrollContent({ padding: 'md', bottomPad: 'lg' }),
              'flex-grow items-center pt-[100px]',
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {immobilityMessage && (
              <View className={toastStyles.root()}>
                <Text className={toastStyles.label()}>{immobilityMessage}</Text>
              </View>
            )}

            <View className="w-full items-center mb-5">
              {selectedIndex === null || !displayNFT ? (
                <Button
                  variant="ghost"
                  feedbackVariant="none"
                  onPress={handleSelectNFT}
                  isDisabled={nfts.length === 0}
                  className={nftPickerButton()}
                >
                  <Text className={ph.icon()}>+</Text>
                  <Button.Label className={ph.label()}>
                    {nfts.length === 0 ? 'No NFTs Available' : 'Select NFT from Vault'}
                  </Button.Label>
                </Button>
              ) : (
                <>
                  <NFTSelector
                    current={selectedIndex + 1}
                    total={nfts.length}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    className="mb-3"
                  />
                  <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
                    <View className={detailStyles.imageWrap()}>
                      <Image
                        source={{ uri: displayNFT.image_url }}
                        className={detailStyles.image()}
                        resizeMode="cover"
                      />
                      <View className={cn(overlayBadge({ position: 'topLeft' }), 'bg-badge-level')}>
                        <Text className={cn(badgeLabel(), 'tracking-wide')}>
                          Lv {displayNFT.level}
                        </Text>
                      </View>
                      <View
                        className={cn(
                          overlayBadge({ position: 'bottomLeft' }),
                          typeBadge({ type: displayNFT.type }),
                        )}
                      >
                        <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>
                          {displayNFT.type.toUpperCase()}
                        </Text>
                      </View>
                      <View
                        className={cn(overlayBadge({ position: 'topRight' }), 'bg-emerald-500/95')}
                      >
                        <Text className={cn(badgeLabel(), 'tracking-wide')}>
                          Energy: {displayNFT.energy}%
                        </Text>
                      </View>
                    </View>

                    <View className={cn(detailStyles.content(), 'p-4')}>
                      <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                        {formatDisplayName(displayNFT.name)}
                      </Text>
                      <NFTProperties
                        efficiency={displayNFT.efficiency}
                        resilience={displayNFT.resilience}
                        comfort={displayNFT.comfort}
                        luck={displayNFT.luck}
                        energy={displayNFT.energy}
                        mode="compact"
                      />
                    </View>
                  </View>
                </>
              )}
            </View>

            <Button
              variant="ghost"
              feedbackVariant="none"
              onPress={handlePoop}
              isDisabled={buttonDisabled}
              className={cn(tactileButton({ variant: 'primary' }), 'px-12')}
              accessibilityLabel={onCooldown ? `Cooldown: ${cooldown?.display}` : 'Start pooping'}
              accessibilityHint={onCooldown ? 'NFT is resting' : 'Begin your toilet session'}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                {buttonLabel}
              </Button.Label>
            </Button>
          </ScrollView>
        </ScrollShadow>
      )}

      {statModalData && (
        <StatAllocationModal
          visible
          nft={statModalData.nft}
          pointsAvailable={statModalData.points}
          onComplete={handleStatAllocated}
          onDismiss={handleStatModalDismiss}
        />
      )}

      <Dialog
        isOpen={alertDialog !== null}
        onOpenChange={(open) => {
          if (!open) setAlertDialog(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className={dialogBody()}>
              <Dialog.Title>{alertDialog?.title ?? ''}</Dialog.Title>
              <Dialog.Description>{alertDialog?.message ?? ''}</Dialog.Description>
            </View>
            <View className={dialogFooter()}>
              <Button
                animation="disable-all"
                variant="ghost"
                feedbackVariant="none"
                onPress={() => setAlertDialog(null)}
                className={tactileButton({ variant: 'primary', size: 'sm' })}
              >
                <Button.Label className={tactileButtonText({ variant: 'primary', size: 'sm' })}>
                  OK
                </Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
})
