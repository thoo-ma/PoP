import { useScrollToTop } from '@react-navigation/native'
import { memo, type ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  CooldownTimer,
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
} from '@/components'
import { Button, cn, Dialog } from '@/components/ui'
import {
  useAnnounce,
  useImmobilityChallenge,
  usePoopNFT,
  usePoopStateMachine,
  useToiletDetection,
  useUserNFTs,
} from '@/hooks'
import { dialogBody, dialogFooter, scrollContent } from '@/styles'
import type { AllocateResult, NFT } from '@/types'
import { getCooldownStatus } from '@/utils/proof/cooldown'

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
 * Phase transitions are owned by `usePoopStateMachine`. This screen reads
 * `phase` from the hook, dispatches actions on user input, and orchestrates
 * the server-side `poopNFT` mutation when a flush is detected.
 */
export default memo(function Poop() {
  // ── NFT data ──────────────────────────────────────────────
  const { nfts, loading, error, refetch } = useUserNFTs()
  const { poopNFT, isPending: actionLoading, cooldownError } = usePoopNFT()
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

  // ── Alert dialog state ─────────────────────────────────────
  const [alertDialog, setAlertDialog] = useState<{ title: string; message: string } | null>(null)

  // Force a single re-render when a CooldownTimer fires onExpire so
  // buttonDisabled / buttonLabel recompute and the Poop button re-enables.
  const [, setCooldownExpiry] = useState(0)
  const handleCooldownExpired = () => setCooldownExpiry((v) => v + 1)

  // ── Proof hooks ────────────────────────────────────────────
  const immobility = useImmobilityChallenge('normal')
  const recording = useToiletDetection()
  const {
    isRecording,
    detectionResult,
    isAnalyzing,
    error: detectionError,
    rateLimitError,
    stopRecording,
  } = recording

  const announce = useAnnounce()

  // ── Phase state machine ───────────────────────────────────
  const {
    phase,
    activeNFT,
    countdownValue,
    remainingTime,
    immobilityStatus,
    immobilityMessage,
    hasPoopedRef,
    start: startGame,
    cancelCountdownOrImmobility,
    cancelPrompt,
    cancelRecording,
    beginRecording,
    goToRoulette,
    reset: resetStateMachine,
  } = usePoopStateMachine({ immobility, recording })

  // ── Derived ────────────────────────────────────────────────
  const displayNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null

  // ── Screen reader announcements ───────────────────────────
  // Announce at phase transitions (excluding idle — that's the default state).
  useEffect(() => {
    switch (phase) {
      case 'countdown':
        announce('Get ready, countdown starting')
        break
      case 'immobility':
        announce('Hold your phone still')
        break
      default:
        break
    }
  }, [phase, announce])

  // Announce only once recording has actually started.
  useEffect(() => {
    if (phase === 'recording' && isRecording) {
      announce('Recording started, detecting flush')
    }
  }, [phase, isRecording, announce])

  // Announce when audio analysis begins (isAnalyzing flips true mid-recording).
  useEffect(() => {
    if (phase === 'recording' && isAnalyzing) {
      announce('Analyzing audio')
    }
  }, [phase, isAnalyzing, announce])

  // Announce results only once poopedPoop is populated (server data ready).
  useEffect(() => {
    if (phase !== 'results') return
    if (detectionResult?.detected && poopedPoop !== null) {
      announce(`Flush detected! You earned ${poopedPoop.earned} POOP`)
    } else if (detectionResult && !detectionResult.detected) {
      announce('No flush detected')
    }
  }, [phase, detectionResult, poopedPoop, announce])

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

  // kept: closes over `phase` to guard carousel swipes; without useCallback the guard captures a stale
  // `phase` value and allows swiping during active challenge phases (countdown, immobility, recording).
  const handlePrev = useCallback(() => {
    if (phase !== 'idle') return
    setSelectedIndex((i) => ((i as number) - 1 + nfts.length) % nfts.length)
    setPoopedEnergy(null)
    setPoopedXP(null)
    setPoopedPoop(null)
    setStatModalData(null)
  }, [nfts.length, phase])

  // kept: closes over `phase` to guard carousel swipes; without useCallback the guard captures a stale
  // `phase` value and allows swiping during active challenge phases (countdown, immobility, recording).
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
      announce(`Cooldown active, ${cooldown.display} remaining`)
      setAlertDialog({
        title: 'On Cooldown',
        message: `This NFT is resting. Ready in ${cooldown.display}.`,
      })
      return
    }
    startGame(displayNFT)
  }

  // ── Master reset ──────────────────────────────────────────
  // kept: in the roulette-fallback useEffect dep array directly below; without useCallback it recreates
  // on every render, which would cause that effect to call resetStateMachine on every render while in
  // the roulette phase instead of only when it first enters with no lootRollId.
  const handleFullReset = useCallback(() => {
    setPoopedEnergy(null)
    setPoopedXP(null)
    setPoopedPoop(null)
    setStatModalData(null)
    setLootRollId(null)
    resetStateMachine()
  }, [resetStateMachine])

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
    if (!activeNFT) return

    hasPoopedRef.current = true
    const snapshotNFT = activeNFT
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
  }, [phase, detectionResult, activeNFT, cooldownError, handleFullReset, poopNFT, hasPoopedRef])

  // ── Stat allocation ───────────────────────────────────────
  const handleStatAllocated = (_result: AllocateResult) => {
    setStatModalData(null)
  }
  const handleStatModalDismiss = () => setStatModalData(null)

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
  const buttonLabel: string | ReactElement = actionLoading ? (
    'Processing...'
  ) : noEnergy ? (
    'No Energy'
  ) : onCooldown && cooldown?.endsAt != null ? (
    <Button.Label>
      Ready in <CooldownTimer endsAt={cooldown.endsAt} onExpire={handleCooldownExpired} />
    </Button.Label>
  ) : selectedIndex === null ? (
    'Select an NFT'
  ) : (
    'Poop'
  )

  return (
    <>
      {phase !== 'idle' ? (
        // ── Active challenge ───────────────────────────────
        // bg-background (vs bg-surface): active challenge uses a darker base
        // to create contrast for countdown/immobility/prompt/results phases.
        <View className="flex-1" accessibilityLiveRegion="polite">
          <ScrollView
            ref={scrollRef}
            className="bg-background"
            contentContainerClassName={cn(
              scrollContent({ padding: 'md', bottomPad: 'withHeader' }),
              'flex-grow items-center pt-screen-top-md',
            )}
            showsVerticalScrollIndicator={false}
          >
            {phase === 'countdown' && activeNFT && (
              <CountdownPhase
                nft={activeNFT}
                countdownValue={countdownValue}
                onCancel={cancelCountdownOrImmobility}
              />
            )}
            {phase === 'immobility' && activeNFT && (
              <ImmobilityPhase
                nft={activeNFT}
                remainingTime={remainingTime}
                status={immobilityStatus}
                onCancel={cancelCountdownOrImmobility}
              />
            )}
            {phase === 'prompt' && activeNFT && (
              <PromptPhase
                nft={activeNFT}
                onStartRecording={beginRecording}
                onCancel={cancelPrompt}
              />
            )}
            {phase === 'recording' && activeNFT && (
              <RecordingPhase
                nft={activeNFT}
                isRecording={isRecording}
                isAnalyzing={isAnalyzing}
                onStop={stopRecording}
                onCancel={cancelRecording}
              />
            )}
            {phase === 'results' && activeNFT && (
              <ResultsPhase
                nft={activeNFT}
                rateLimitError={rateLimitError}
                detectionError={detectionError}
                detectionResult={detectionResult}
                poopedEnergy={poopedEnergy}
                poopedXP={poopedXP}
                poopedPoop={poopedPoop}
                actionLoading={actionLoading}
                lootRollId={lootRollId}
                onRoulette={goToRoulette}
                onReset={handleFullReset}
              />
            )}
            {phase === 'roulette' && activeNFT && lootRollId && (
              <RoulettePhase nft={activeNFT} lootRollId={lootRollId} onDone={handleFullReset} />
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
              'flex-grow items-center pt-screen-top-md',
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <IdlePhase
              nft={{ nfts, selectedIndex, displayNFT }}
              ui={{ buttonDisabled, buttonLabel, immobilityMessage }}
              a11y={{
                // On cooldown: omit accessibilityLabel so RN derives it from
                // <Button.Label> children (the live CooldownTimer text) instead
                // of a stale snapshot. Static label for all other branches.
                label: onCooldown ? undefined : 'Start pooping',
                hint: onCooldown ? 'NFT is resting' : 'Begin your toilet session',
              }}
              handlers={{
                onSelectNFT: handleSelectNFT,
                onPrev: handlePrev,
                onNext: handleNext,
                onPoop: handlePoop,
              }}
            />
          </ScrollView>
        </View>
      )}

      {statModalData && (
        <StatAllocationModal
          isVisible
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
                variant="primary"
                size="sm"
                onPress={() => setAlertDialog(null)}
              >
                <Button.Label>OK</Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
})
