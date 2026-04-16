import { getThresholdForDifficulty } from '@pop/shared'
import { useScrollToTop } from '@react-navigation/native'
import { cn, Dialog } from 'heroui-native'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  CountdownPhase,
  IdlePhase,
  ImmobilityPhase,
  PromptPhase,
  RecordingPhase,
  ResultsPhase,
  RoulettePhase,
  ScreenError,
  ScreenLoader,
  StatAllocationModal,
  TactileButton,
} from '@/components'
import { getCooldownStatus } from '@/constants'
import { useImmobilityChallenge, usePoopNFT, useToiletDetection, useUserNFTs } from '@/hooks'
import { dialogBody, dialogFooter, scrollContent } from '@/styles'
import type { AllocateResult, NFT } from '@/types'

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
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  const hasPoopedRef = useRef(false) // guard — call poopNFT exactly once per challenge
  const activeNFTRef = useRef<NFT | null>(null) // snapshot of the NFT that started the challenge

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
    activeNFTRef.current = displayNFT
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
      activeNFTRef.current = null
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
    activeNFTRef.current = null
    stopChallenge()
    setFrozenRemainingTime(null)
    setPhase('idle')
  }
  const handleCancelPrompt = () => {
    activeNFTRef.current = null
    setPhase('idle')
  }
  const handleCancelRecording = () => {
    activeNFTRef.current = null
    clearResult()
    setPhase('idle')
  }

  // ── Prompt → recording ────────────────────────────────────
  const handleStartRecording = () => {
    setPhase('recording')
    startRecording()
  }

  // Auto-analyze once audioUri is available.
  // Guard on !detectionError so a failed attempt does not re-trigger analyzeAudio
  // (which would call clearError() and wipe the error before the phase transition
  // to 'results', causing a flash of the success state).
  useEffect(() => {
    if (phase === 'recording' && audioUri && !isAnalyzing && !detectionResult && !detectionError) {
      analyzeAudio(GAME_THRESHOLD)
    }
  }, [phase, audioUri, isAnalyzing, detectionResult, detectionError, analyzeAudio])

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
    activeNFTRef.current = null
    setPoopedEnergy(null)
    setPoopedXP(null)
    setPoopedPoop(null)
    setStatModalData(null)
    setLootRollId(null)
    setFrozenRemainingTime(null)
    setImmobilityMessage(null)
    setPhase('idle')
  }, [clearResult])

  // Fallback: roulette phase entered but no pending roll (edge function failed to upsert)
  useEffect(() => {
    if (phase === 'roulette' && !lootRollId) {
      handleFullReset()
    }
  }, [phase, lootRollId, handleFullReset])

  // ── Grant XP on confirmed flush ───────────────────────────
  useEffect(() => {
    if (phase !== 'results') return
    if (hasPoopedRef.current) return
    if (!detectionResult?.detected) return
    if (!activeNFTRef.current) return

    hasPoopedRef.current = true
    const snapshotNFT = activeNFTRef.current
    ;(async () => {
      const result = await poopNFT(snapshotNFT.id)
      if (result) {
        setPoopedEnergy({ from: snapshotNFT.energy, to: result.energy })
        setPoopedXP({
          gained: result.xp_gained,
          level: result.level,
          leveledUp: result.leveled_up,
        })
        setPoopedPoop({ earned: result.poop_earned, balance: result.poop_balance })
        setLootRollId(result.loot_roll_id ?? null)
        if (result.leveled_up && result.stat_points > 0) {
          setStatModalData({
            nft: { ...snapshotNFT, stat_points: result.stat_points },
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
  }, [phase, detectionResult, cooldownError, handleFullReset, poopNFT])

  // ── Stat allocation ───────────────────────────────────────
  const handleStatAllocated = useCallback((_result: AllocateResult) => {
    setStatModalData(null)
  }, [])
  const handleStatModalDismiss = useCallback(() => setStatModalData(null), [])

  // ── Early returns ─────────────────────────────────────────
  if (loading) return <ScreenLoader title="Poop" message="Loading your collection..." />
  if (error) return <ScreenError title="Poop" message={`Error: ${error}`} onRetry={refetch} />

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

  return (
    <>
      {phase !== 'idle' ? (
        // ── Active challenge ───────────────────────────────
        // bg-background (vs bg-surface): active challenge uses a darker base
        // to create contrast for countdown/immobility/prompt/results phases.
        <View className="flex-1">
          <ScrollView
            ref={scrollRef}
            className="bg-background"
            contentContainerClassName={cn(
              scrollContent({ padding: 'md', bottomPad: 'withHeader' }),
              'flex-grow items-center pt-[100px]',
            )}
            showsVerticalScrollIndicator={false}
          >
            {phase === 'countdown' && activeNFTRef.current && (
              <CountdownPhase
                nft={activeNFTRef.current}
                countdownValue={countdownValue}
                onCancel={handleCancelCountdownOrImmobility}
              />
            )}
            {phase === 'immobility' && activeNFTRef.current && (
              <ImmobilityPhase
                nft={activeNFTRef.current}
                remainingTime={remainingTime}
                status={status}
                onCancel={handleCancelCountdownOrImmobility}
              />
            )}
            {phase === 'prompt' && activeNFTRef.current && (
              <PromptPhase
                nft={activeNFTRef.current}
                onStartRecording={handleStartRecording}
                onCancel={handleCancelPrompt}
              />
            )}
            {phase === 'recording' && activeNFTRef.current && (
              <RecordingPhase
                nft={activeNFTRef.current}
                isRecording={isRecording}
                isAnalyzing={isAnalyzing}
                onStop={stopRecording}
                onCancel={handleCancelRecording}
              />
            )}
            {phase === 'results' && activeNFTRef.current && (
              <ResultsPhase
                nft={activeNFTRef.current}
                rateLimitError={rateLimitError}
                detectionError={detectionError}
                detectionResult={detectionResult}
                poopedEnergy={poopedEnergy}
                poopedXP={poopedXP}
                poopedPoop={poopedPoop}
                actionLoading={actionLoading}
                lootRollId={lootRollId}
                onRoulette={() => setPhase('roulette')}
                onReset={handleFullReset}
              />
            )}
            {phase === 'roulette' && activeNFTRef.current && lootRollId && (
              <RoulettePhase
                nft={activeNFTRef.current}
                lootRollId={lootRollId}
                onDone={handleFullReset}
              />
            )}
          </ScrollView>
        </View>
      ) : (
        // ── Idle (home) ────────────────────────────────────
        // bg-background: matches active challenge phase for seamless transition.
        <View className="flex-1">
          <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName={cn(
              scrollContent({ padding: 'md', bottomPad: 'withHeader' }),
              'flex-grow items-center pt-[100px]',
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <IdlePhase
              nfts={nfts}
              selectedIndex={selectedIndex}
              displayNFT={displayNFT}
              buttonDisabled={buttonDisabled}
              buttonLabel={buttonLabel}
              accessibilityLabel={onCooldown ? `Cooldown: ${cooldown?.display}` : 'Start pooping'}
              accessibilityHint={onCooldown ? 'NFT is resting' : 'Begin your toilet session'}
              immobilityMessage={immobilityMessage}
              onSelectNFT={handleSelectNFT}
              onPrev={handlePrev}
              onNext={handleNext}
              onPoop={handlePoop}
            />
          </ScrollView>
        </View>
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
              <TactileButton
                animation="disable-all"
                variant="primary"
                size="sm"
                onPress={() => setAlertDialog(null)}
              >
                OK
              </TactileButton>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
})
