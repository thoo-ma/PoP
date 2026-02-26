import { Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { poopStyles as styles } from '@/styles';
import { useUserNFTs, usePoopNFT } from '@/hooks';
import { ScreenLoader, ScreenError, NFTSelector, NFTProperties, StatAllocationModal } from '@/components';
import { nftEvents, formatDisplayName, TYPE_BADGE_STYLES } from '@/utils';
import { getCooldownStatus } from '@/constants/cooldown';
import type { NFT } from '@/types/nft';
import type { AllocateResult } from '@/hooks';

export default memo(function Poop() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { poopNFT, loading: actionLoading, cooldownError } = usePoopNFT();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPooped, setIsPooped] = useState(false);
  const [poopedEnergy, setPoopedEnergy] = useState<{ from: number; to: number } | null>(null);
  const [poopedXP, setPoopedXP] = useState<{ gained: number; level: number; leveledUp: boolean } | null>(null);
  const [statModalData, setStatModalData] = useState<{ nft: NFT; points: number } | null>(null);
  // Tick every second to keep the cooldown countdown accurate.
  const [, setTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setTick(t => t + 1), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  const displayNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null;

  const handleSelectNFT = () => {
    if (nfts.length === 0) return;
    // Prefer NFTs that have energy AND are not on cooldown.
    const ready = nfts.findIndex(nft => nft.energy > 0 && !getCooldownStatus(nft).isOnCooldown);
    const withEnergy = nfts.findIndex(nft => nft.energy > 0);
    setSelectedIndex(ready >= 0 ? ready : withEnergy >= 0 ? withEnergy : 0);
  };

  const handlePoop = async () => {
    if (!displayNFT) return;

    if (displayNFT.energy <= 0) {
      Alert.alert(
        'No Energy',
        'This NFT has no energy left. Visit the Repair screen to restore energy.',
        [{ text: 'OK' }]
      );
      return;
    }

    const cooldown = getCooldownStatus(displayNFT);
    if (cooldown.isOnCooldown) {
      Alert.alert(
        'On Cooldown',
        `This NFT is resting. Ready in ${cooldown.display}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await poopNFT(displayNFT.id);

    if (result) {
      await refetch();
      nftEvents.emit();
      setPoopedEnergy({ from: displayNFT.energy, to: result.energy });
      setPoopedXP({ gained: result.xp_gained, level: result.level, leveledUp: result.leveled_up });
      setIsPooped(true);
      // Open the stat allocation modal straight away if points were earned.
      if (result.leveled_up && result.stat_points > 0) {
        setStatModalData({
          nft:    { ...displayNFT, stat_points: result.stat_points },
          points: result.stat_points,
        });
      }
    } else if (cooldownError) {
      // Server-authoritative cooldown response (clock skew / stale client data)
      const remaining = cooldownError.cooldown_remaining_seconds;
      const hours   = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const display = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      Alert.alert(
        'On Cooldown',
        `This NFT is resting. Ready in ${display}.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Error',
        'Failed to use NFT. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsPooped(false);
    setPoopedEnergy(null);
    setPoopedXP(null);
    setStatModalData(null);
  };

  const handlePrev = useCallback(() => {
    setSelectedIndex(i => ((i as number) - 1 + nfts.length) % nfts.length);
    setIsPooped(false);
    setPoopedEnergy(null);
    setPoopedXP(null);
    setStatModalData(null);
  }, [nfts.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex(i => ((i as number) + 1) % nfts.length);
    setIsPooped(false);
    setPoopedEnergy(null);
    setPoopedXP(null);
    setStatModalData(null);
  }, [nfts.length]);

  const handleStatAllocated = useCallback((_result: AllocateResult) => {
    setStatModalData(null);
    refetch();
    nftEvents.emit();
  }, [refetch]);

  const handleStatModalDismiss = useCallback(() => {
    setStatModalData(null);
  }, []);
  if (loading) {
    return <ScreenLoader title="Poop" message="Loading your collection..." />;
  }

  if (error) {
    return (
      <ScreenError
        title="Poop"
        message={`Error: ${error}`}
        onRetry={refetch}
      />
    );
  }
  
  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={styles.title}>Poop</Text>
      <Text style={styles.description}>
        Use your NFT to generate rewards
      </Text>
      
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
            {!isPooped && (
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
                  <View style={[styles.tierBadge, TYPE_BADGE_STYLES[displayNFT!.type]]}>
                    <Text style={styles.tierBadgeText}>{displayNFT!.type.toUpperCase()}</Text>
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
            )}
          </>
        )}
      </View>

      {selectedIndex !== null && (
        <>
          {isPooped ? (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>✓ Poop Complete!</Text>
              {poopedEnergy && (
                <Text style={styles.successDetail}>
                  Energy: {poopedEnergy.from} → {poopedEnergy.to}
                </Text>
              )}
              {poopedXP && (
                <>
                  <Text style={styles.successDetail}>
                    +{poopedXP.gained} XP
                  </Text>
                  {poopedXP.leveledUp && (
                    <Text style={styles.successDetail}>
                      🎉 Level Up! Now Lv {poopedXP.level}
                    </Text>
                  )}
                </>
              )}
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Poop Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {(() => {
                const cooldown = getCooldownStatus(displayNFT!);
                const onCooldown = cooldown.isOnCooldown;
                const noEnergy   = displayNFT!.energy <= 0;
                const disabled   = actionLoading || noEnergy || onCooldown;
                const label = actionLoading
                  ? 'Processing...'
                  : noEnergy
                  ? 'No Energy'
                  : onCooldown
                  ? `Ready in ${cooldown.display}`
                  : 'Poop';
                return (
                  <TouchableOpacity
                    style={[styles.poopButton, disabled && styles.poopButtonDisabled]}
                    onPress={handlePoop}
                    disabled={disabled}
                    activeOpacity={0.8}
                    accessibilityLabel={onCooldown ? `Cooldown: ${cooldown.display}` : 'Start pooping'}
                    accessibilityRole="button"
                    accessibilityHint={onCooldown ? 'NFT is resting' : 'Begin your toilet session'}
                  >
                    <Text style={styles.poopButtonText}>{label}</Text>
                  </TouchableOpacity>
                );
              })()}
            </>
          )}
        </>
      )}
      </ScrollView>

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
