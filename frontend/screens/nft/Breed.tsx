import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { memo, useState } from 'react';
import { breedStyles as styles } from '@/styles';
import { useUserNFTs, useBreedNFT } from '@/hooks';
import type { NFT } from '@/types/nft';
import { NFTProperties, ScreenLoader, ScreenError, BreedPickerModal, BreedOutcomePanel, BreedParentSlot } from '@/components';
import { nftEvents, canBreed, formatDisplayName, TYPE_BADGE_STYLES } from '@/utils';
import { RARITY_COLORS } from '@/constants';

// ─── Main screen ──────────────────────────────────────────────────────────────

export default memo(function Breed() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { breedNFTs, loading: breedLoading, error: breedError } = useBreedNFT();

  const [parent1, setParent1] = useState<NFT | null>(null);
  const [parent2, setParent2] = useState<NFT | null>(null);
  const [pickerSlot, setPickerSlot] = useState<1 | 2 | null>(null);
  const [breedResult, setBreedResult] = useState<NFT | null>(null);
  const [resultParent1, setResultParent1] = useState<NFT | null>(null);
  const [resultParent2, setResultParent2] = useState<NFT | null>(null);

  // When parent1 changes, clear parent2 if it is no longer compatible
  const handleSetParent1 = (nft: NFT) => {
    setParent1(nft);
    if (parent2 && (parent2.id === nft.id || !canBreed(nft.rarity, parent2.rarity))) {
      setParent2(null);
    }
  };

  const handleBreed = async () => {
    if (!parent1 || !parent2) return;
    setResultParent1(parent1);
    setResultParent2(parent2);
    const newNFT = await breedNFTs(parent1.id, parent2.id);
    if (newNFT) {
      setBreedResult(newNFT);
      nftEvents.emit();
    }
    // Error is surfaced inline — no Alert
  };

  const handleReset = () => {
    setParent1(null);
    setParent2(null);
    setBreedResult(null);
    setResultParent1(null);
    setResultParent2(null);
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return <ScreenLoader title="Breed" />;
  if (error)   return <ScreenError title="Breed" message={`Error: ${error}`} onRetry={refetch} />;

  if (nfts.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Breed</Text>
        <Text style={styles.description}>You need at least 2 NFTs to breed</Text>
      </View>
    );
  }

  const canBreedNow = Boolean(parent1 && parent2);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breed</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Picker modal ──────────────────────────────────────────────── */}
        <BreedPickerModal
          visible={pickerSlot === 1}
          title="Choose Parent 1"
          allNFTs={nfts}
          lockedId={parent2?.id}
          onSelect={handleSetParent1}
          onClose={() => setPickerSlot(null)}
        />
        <BreedPickerModal
          visible={pickerSlot === 2}
          title="Choose Parent 2"
          allNFTs={nfts}
          lockedId={parent1?.id}
          lockedRarity={parent1?.rarity}
          onSelect={setParent2}
          onClose={() => setPickerSlot(null)}
        />

        {!breedResult ? (
          <>
            {/* ── Parent slots ──────────────────────────────────────────── */}
            <View style={styles.parentsRow}>
              <BreedParentSlot
                nft={parent1}
                label="Choose Parent 1"
                onPress={() => setPickerSlot(1)}
              />
              <View style={styles.vsColumn}>
                <Text style={styles.vsText}>×</Text>
              </View>
              <BreedParentSlot
                nft={parent2}
                label="Choose Parent 2"
                onPress={() => setPickerSlot(2)}
              />
            </View>

            {/* ── Outcome probabilities ─────────────────────────────────── */}
            {canBreedNow ? (
              <BreedOutcomePanel r1={parent1!.rarity} r2={parent2!.rarity} />
            ) : (
              <View style={styles.outcomePlaceholder}>
                <Text style={styles.outcomePlaceholderText}>
                  Select both parents to see outcome probabilities
                </Text>
              </View>
            )}

            {/* ── Breed error ───────────────────────────────────────────── */}
            {breedError && (
              <Text style={styles.breedError}>{breedError}</Text>
            )}

            {/* ── Breed button ──────────────────────────────────────────── */}
            <TouchableOpacity
              style={[
                styles.breedButton,
                (!canBreedNow || breedLoading) && styles.breedButtonDisabled,
              ]}
              onPress={handleBreed}
              disabled={!canBreedNow || breedLoading}
            >
              <Text style={styles.breedButtonText}>
                {breedLoading ? 'Breeding…' : 'Breed'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* ── Result ───────────────────────────────────────────────────── */
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🎉 New NFT Created!</Text>

            {/* Parents summary */}
            <View style={styles.resultParentsRow}>
              <Image source={{ uri: resultParent1?.image_url }} style={styles.resultParentThumb} />
              <Text style={styles.resultCross}>×</Text>
              <Image source={{ uri: resultParent2?.image_url }} style={styles.resultParentThumb} />
              <Text style={styles.resultArrow}>→</Text>
            </View>

            {/* Offspring card */}
            <View style={[styles.resultCard, { borderColor: RARITY_COLORS[breedResult.rarity] }]}>
              <View style={styles.resultImageContainer}>
                <Image
                  source={{ uri: breedResult.image_url }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Lv {breedResult.level}</Text>
                </View>
                <View style={[styles.typeBadge, TYPE_BADGE_STYLES[breedResult.type]]}>
                  <Text style={styles.typeBadgeText}>{breedResult.type.toUpperCase()}</Text>
                </View>
                <View style={[styles.rarityBadge, { backgroundColor: RARITY_COLORS[breedResult.rarity] }]}>
                  <Text style={styles.rarityBadgeText}>{breedResult.rarity.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.resultCardContent}>
                <Text style={styles.resultLabel}>{formatDisplayName(breedResult.name)}</Text>
                <NFTProperties
                  efficiency={breedResult.efficiency}
                  resilience={breedResult.resilience}
                  comfort={breedResult.comfort}
                  luck={breedResult.luck}
                  mode="detailed"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Breed Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
});
