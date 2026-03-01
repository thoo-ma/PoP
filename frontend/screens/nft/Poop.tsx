import { Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { poopStyles as styles } from '@/styles';
import { useUserNFTs, usePoopNFT, useImmobilityChallenge, useToiletDetection } from '@/hooks';
import { ScreenLoader, ScreenError, NFTSelector, NFTProperties, StatAllocationModal } from '@/components';
import { nftEvents, formatDisplayName, TYPE_BADGE_STYLES, getThresholdForDifficulty, formatConfidencePercentage } from '@/utils';
import { getCooldownStatus } from '@/constants';
import type { NFT } from '@/types';
import type { AllocateResult } from '@/hooks';

const IMMOBILITY_MS_BY_TYPE: Record<NFT['type'], number> = {
  'turbo-flush':  5_000,
  'cruise-seat':  10_000,
  'zen-fortress': 15_000,
};
const GAME_THRESHOLD = getThresholdForDifficulty('normal'); // 0.7

type GamePhase = 'idle' | 'countdown' | 'immobility' | 'prompt' | 'recording' | 'results';

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
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { poopNFT, loading: actionLoading, cooldownError } = usePoopNFT();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [poopedEnergy, setPoopedEnergy] = useState<{ from: number; to: number } | null>(null);
  const [poopedXP, setPoopedXP] = useState<{ gained: number; level: number; leveledUp: boolean } | null>(null);
  const [statModalData, setStatModalData] = useState<{ nft: NFT; points: number } | null>(null);
  const hasPoopedRef = useRef(false); // guard — call poopNFT exactly once per challenge

  // Tick once/s so the cooldown countdown refreshes in the UI
  const [, setTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    tickRef.current = setInterval(() => setTick(t => t + 1), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // ── Challenge state ────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [gameImmobilityMs, setGameImmobilityMs] = useState(10_000); // set at challenge start
  const [frozenRemainingTime, setFrozenRemainingTime] = useState<number | null>(null);
  const [immobilityMessage, setImmobilityMessage] = useState<string | null>(null);

  // ── Proof hooks ────────────────────────────────────────────
  const { elapsedTime, status, isRunning, startChallenge, stopChallenge } =
    useImmobilityChallenge('normal');

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
  } = useToiletDetection();

  // ── Derived ────────────────────────────────────────────────
  const displayNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null;
  const remainingTime = frozenRemainingTime !== null
    ? frozenRemainingTime
    : Math.max(0, gameImmobilityMs - elapsedTime);

  // ── NFT carousel (disabled during challenge) ───────────────
  const handleSelectNFT = () => {
    if (nfts.length === 0) return;
    const ready      = nfts.findIndex(n => n.energy > 0 && !getCooldownStatus(n).isOnCooldown);
    const withEnergy = nfts.findIndex(n => n.energy > 0);
    setSelectedIndex(ready >= 0 ? ready : withEnergy >= 0 ? withEnergy : 0);
  };

  const handlePrev = useCallback(() => {
    if (phase !== 'idle') return;
    setSelectedIndex(i => ((i as number) - 1 + nfts.length) % nfts.length);
    setPoopedEnergy(null); setPoopedXP(null); setStatModalData(null);
  }, [nfts.length, phase]);

  const handleNext = useCallback(() => {
    if (phase !== 'idle') return;
    setSelectedIndex(i => ((i as number) + 1) % nfts.length);
    setPoopedEnergy(null); setPoopedXP(null); setStatModalData(null);
  }, [nfts.length, phase]);

  // ── Tap Poop: guards → begin 3-2-1 ────────────────────────
  const handlePoop = () => {
    if (!displayNFT) return;
    if (displayNFT.energy <= 0) {
      Alert.alert('No Energy', 'This NFT has no energy left. Visit the Repair screen to restore energy.', [{ text: 'OK' }]);
      return;
    }
    const cooldown = getCooldownStatus(displayNFT);
    if (cooldown.isOnCooldown) {
      Alert.alert('On Cooldown', `This NFT is resting. Ready in ${cooldown.display}.`, [{ text: 'OK' }]);
      return;
    }
    hasPoopedRef.current = false;
    setCountdownValue(3);
    setGameImmobilityMs(IMMOBILITY_MS_BY_TYPE[displayNFT.type] ?? 10_000);
    setPhase('countdown');
  };

  // ── 3-2-1 countdown ───────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    const id = setInterval(() => {
      setCountdownValue(v => {
        if (v <= 1) {
          clearInterval(id);
          setFrozenRemainingTime(null);
          startChallenge();
          setPhase('immobility');
          return 1;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, startChallenge]);

  // ── Immobility phase monitor ───────────────────────────────
  useEffect(() => {
    if (phase !== 'immobility') return;

    if (status === 'warning' && frozenRemainingTime === null) {
      setFrozenRemainingTime(Math.max(0, gameImmobilityMs - elapsedTime));
    }
    if (status === 'running' && frozenRemainingTime !== null) {
      setFrozenRemainingTime(null);
    }
    if (elapsedTime >= gameImmobilityMs && status === 'running') {
      stopChallenge();
      setPhase('prompt');
      return;
    }
    // Hook reset challenge (grace period expired): isRunning=false, status='idle', elapsedTime=0
    if (!isRunning && status === 'idle' && elapsedTime === 0) {
      setFrozenRemainingTime(null);
      setImmobilityMessage('Too much movement — try again!');
      setPhase('idle');
    }
  }, [phase, elapsedTime, status, isRunning, frozenRemainingTime, stopChallenge]);

  // Auto-clear the toast after 3 s
  useEffect(() => {
    if (!immobilityMessage) return;
    const id = setTimeout(() => setImmobilityMessage(null), 3000);
    return () => clearTimeout(id);
  }, [immobilityMessage]);

  // ── Cancel helpers ─────────────────────────────────────────
  const handleCancelCountdownOrImmobility = () => {
    stopChallenge();
    setFrozenRemainingTime(null);
    setPhase('idle');
  };
  const handleCancelPrompt = () => setPhase('idle');
  const handleCancelRecording = () => { clearResult(); setPhase('idle'); };

  // ── Prompt → recording ────────────────────────────────────
  const handleStartRecording = () => {
    setPhase('recording');
    startRecording();
  };

  // Auto-analyze once audioUri is available
  useEffect(() => {
    if (phase === 'recording' && audioUri && !isAnalyzing && !detectionResult) {
      analyzeAudio(GAME_THRESHOLD);
    }
  }, [phase, audioUri, isAnalyzing, detectionResult, analyzeAudio]);

  // Transition to results
  useEffect(() => {
    if (phase === 'recording' && (detectionResult || rateLimitError || (detectionError && !isAnalyzing))) {
      setPhase('results');
    }
  }, [phase, detectionResult, rateLimitError, detectionError, isAnalyzing]);

  // ── Grant XP on confirmed flush ───────────────────────────
  useEffect(() => {
    if (phase !== 'results') return;
    if (hasPoopedRef.current) return;
    if (!detectionResult?.detected) return;
    if (!displayNFT) return;

    hasPoopedRef.current = true;
    (async () => {
      const result = await poopNFT(displayNFT.id);
      if (result) {
        await refetch();
        nftEvents.emit();
        setPoopedEnergy({ from: displayNFT.energy, to: result.energy });
        setPoopedXP({ gained: result.xp_gained, level: result.level, leveledUp: result.leveled_up });
        if (result.leveled_up && result.stat_points > 0) {
          setStatModalData({ nft: { ...displayNFT, stat_points: result.stat_points }, points: result.stat_points });
        }
      } else if (cooldownError) {
        const rem  = cooldownError.cooldown_remaining_seconds;
        const h    = Math.floor(rem / 3600);
        const m    = Math.floor((rem % 3600) / 60);
        const disp = h > 0 ? `${h}h ${m}m` : `${m}m`;
        Alert.alert('On Cooldown', `This NFT is resting. Ready in ${disp}.`, [{ text: 'OK' }]);
        handleFullReset();
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, detectionResult]);

  // ── Master reset ──────────────────────────────────────────
  const handleFullReset = useCallback(() => {
    clearResult();
    hasPoopedRef.current = false;
    setPoopedEnergy(null);
    setPoopedXP(null);
    setStatModalData(null);
    setFrozenRemainingTime(null);
    setImmobilityMessage(null);
    setPhase('idle');
  }, [clearResult]);

  // ── Stat allocation ───────────────────────────────────────
  const handleStatAllocated = useCallback((_result: AllocateResult) => {
    setStatModalData(null); refetch(); nftEvents.emit();
  }, [refetch]);
  const handleStatModalDismiss = useCallback(() => setStatModalData(null), []);

  // ── Early returns ─────────────────────────────────────────
  if (loading) return <ScreenLoader title="Poop" message="Loading your collection..." />;
  if (error)   return <ScreenError title="Poop" message={`Error: ${error}`} onRetry={refetch} />;

  // ═════════════════════════════════════════════════════════
  // RENDERERS
  // ═════════════════════════════════════════════════════════

  const renderChallengeHeader = () => {
    if (!displayNFT) return null;
    return (
      <View style={styles.challengeHeader}>
        <Image source={{ uri: displayNFT.image_url }} style={styles.challengeNFTAvatar} resizeMode="cover" />
        <View style={styles.challengeNFTInfo}>
          <Text style={styles.challengeNFTName}>{formatDisplayName(displayNFT.name)}</Text>
          <Text style={styles.challengeNFTMeta}>Lv {displayNFT.level} · {displayNFT.type}</Text>
        </View>
      </View>
    );
  };

  const renderCountdownPhase = () => (
    <View style={styles.challengeContainer}>
      {renderChallengeHeader()}
      <View style={styles.countdownOverlay}>
        <Text style={styles.countdownNumber}>{countdownValue}</Text>
        <Text style={styles.countdownLabel}>Get ready…</Text>
      </View>
      <TouchableOpacity style={styles.cancelLink} onPress={handleCancelCountdownOrImmobility}>
        <Text style={styles.cancelLinkText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderImmobilityPhase = () => {
    const isWarning = status === 'warning';
    return (
      <View style={styles.challengeContainer}>
        {renderChallengeHeader()}
        <View style={styles.countdownOverlay}>
          <Text style={[styles.countdownNumber, isWarning && styles.countdownFrozen]}>
            {(remainingTime / 1000).toFixed(1)}s
          </Text>
          <View style={[styles.statusBadge, isWarning ? styles.statusBadgeWarning : styles.statusBadgeRunning]}>
            <Text style={styles.statusBadgeText}>
              {isWarning ? '🔴 Movement detected!' : '🟢 Hold still'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cancelLink} onPress={handleCancelCountdownOrImmobility}>
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPromptPhase = () => (
    <View style={styles.challengeContainer}>
      {renderChallengeHeader()}
      <View style={styles.phaseCard}>
        <Text style={styles.phaseCardSuccess}>✓ Immobility confirmed!</Text>
        <Text style={styles.phaseCardSub}>Now record the flush sound</Text>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={handleStartRecording}>
        <Text style={styles.actionButtonText}>Start Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelLink} onPress={handleCancelPrompt}>
        <Text style={styles.cancelLinkText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecordingPhase = () => (
    <View style={styles.challengeContainer}>
      {renderChallengeHeader()}
      {isAnalyzing ? (
        <View style={styles.phaseCard}>
          <Text style={styles.phaseCardLabel}>🔍 Analyzing audio…</Text>
        </View>
      ) : isRecording ? (
        <View style={styles.phaseCard}>
          <View style={styles.recordingRow}>
            <View style={styles.recordingDot} />
            <Text style={styles.phaseCardLabel}>Recording…</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={stopRecording}>
            <Text style={styles.actionButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.phaseCard}>
          <Text style={styles.phaseCardLabel}>Processing…</Text>
        </View>
      )}
      {!isAnalyzing && (
        <TouchableOpacity style={styles.cancelLink} onPress={handleCancelRecording}>
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderResultsPhase = () => {
    if (rateLimitError) {
      return (
        <View style={styles.challengeContainer}>
          {renderChallengeHeader()}
          <View style={[styles.resultCard, styles.resultError]}>
            <Text style={styles.resultTitle}>Daily limit reached</Text>
            <Text style={styles.resultSub}>{rateLimitError.message}</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleFullReset}>
            <Text style={styles.actionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (detectionError && !detectionResult) {
      return (
        <View style={styles.challengeContainer}>
          {renderChallengeHeader()}
          <View style={[styles.resultCard, styles.resultError]}>
            <Text style={styles.resultTitle}>Something went wrong</Text>
            <Text style={styles.resultSub}>{detectionError}</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleFullReset}>
            <Text style={styles.actionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (detectionResult && !detectionResult.detected) {
      return (
        <View style={styles.challengeContainer}>
          {renderChallengeHeader()}
          <View style={[styles.resultCard, styles.resultFailure]}>
            <Text style={styles.resultTitle}>Flush not detected</Text>
            <Text style={styles.resultSub}>Confidence: {formatConfidencePercentage(detectionResult.confidence)}</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleFullReset}>
            <Text style={styles.actionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // Success
    return (
      <View style={styles.challengeContainer}>
        {renderChallengeHeader()}
        <View style={[styles.resultCard, styles.resultSuccess]}>
          <Text style={styles.resultTitle}>💧 Flush confirmed!</Text>
          {poopedEnergy && (
            <Text style={styles.resultSub}>Energy: {poopedEnergy.from} → {poopedEnergy.to}</Text>
          )}
          {poopedXP && (
            <>
              <Text style={styles.resultSub}>+{poopedXP.gained} XP</Text>
              {poopedXP.leveledUp && (
                <Text style={styles.resultSub}>🎉 Level Up! Now Lv {poopedXP.level}</Text>
              )}
            </>
          )}
          {actionLoading && <Text style={styles.resultSub}>Saving…</Text>}
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={handleFullReset}>
          <Text style={styles.actionButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ═════════════════════════════════════════════════════════
  // IDLE SCREEN
  // ═════════════════════════════════════════════════════════
  const cooldown      = displayNFT ? getCooldownStatus(displayNFT) : null;
  const onCooldown    = cooldown?.isOnCooldown ?? false;
  const noEnergy      = displayNFT ? displayNFT.energy <= 0 : false;
  const buttonDisabled = actionLoading || noEnergy || onCooldown || selectedIndex === null;
  const buttonLabel   = actionLoading
    ? 'Processing...'
    : noEnergy
    ? 'No Energy'
    : onCooldown
    ? `Ready in ${cooldown!.display}`
    : selectedIndex === null
    ? 'Select an NFT'
    : 'Poop';

  return (
    <>
      {phase !== 'idle' ? (
        // ── Active challenge ───────────────────────────────
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {phase === 'countdown'  && renderCountdownPhase()}
          {phase === 'immobility' && renderImmobilityPhase()}
          {phase === 'prompt'     && renderPromptPhase()}
          {phase === 'recording'  && renderRecordingPhase()}
          {phase === 'results'    && renderResultsPhase()}
        </ScrollView>
      ) : (
        // ── Idle (home) ────────────────────────────────────
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Poop</Text>
          <Text style={styles.description}>Use your NFT to generate rewards</Text>

          {immobilityMessage && (
            <View style={styles.toastMessage}>
              <Text style={styles.toastMessageText}>{immobilityMessage}</Text>
            </View>
          )}

          <View style={styles.nftContainer}>
            {selectedIndex === null ? (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectNFT}
                disabled={nfts.length === 0}
              >
                <Text style={styles.plusIcon}>+</Text>
                <Text style={styles.selectText}>
                  {nfts.length === 0 ? 'No NFTs Available' : 'Select NFT from Vault'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <NFTSelector
                  current={selectedIndex + 1}
                  total={nfts.length}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  style={{ marginBottom: 12 }}
                />
                <View style={styles.nftCard}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: displayNFT!.image_url }}
                      style={styles.nftImage}
                      resizeMode="cover"
                    />
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>Lv {displayNFT!.level}</Text>
                    </View>
                    <View style={[styles.typeBadge, TYPE_BADGE_STYLES[displayNFT!.type]]}>
                      <Text style={styles.typeBadgeText}>{displayNFT!.type.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.nftInfo}>
                    <Text style={styles.nftName}>{formatDisplayName(displayNFT!.name)}</Text>
                    <NFTProperties
                      efficiency={displayNFT!.efficiency}
                      resilience={displayNFT!.resilience}
                      comfort={displayNFT!.comfort}
                      luck={displayNFT!.luck}
                      energy={displayNFT!.energy}
                      mode="detailed"
                    />
                  </View>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            style={[styles.poopButton, buttonDisabled && styles.poopButtonDisabled]}
            onPress={handlePoop}
            disabled={buttonDisabled}
            activeOpacity={0.8}
            accessibilityLabel={onCooldown ? `Cooldown: ${cooldown!.display}` : 'Start pooping'}
            accessibilityRole="button"
            accessibilityHint={onCooldown ? 'NFT is resting' : 'Begin your toilet session'}
          >
            <Text style={styles.poopButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </ScrollView>
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
    </>
  );
});
