import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { memo, useState } from 'react';
import { breedStyles as styles } from '@/styles';
import { useUserNFTs, useBreedNFT, useWallet } from '@/hooks';
import type { NFT } from '@/types/nft';
import type { MysteryBox } from '@shared';
import { POOP_BREED_COST } from '@shared';
import { MysteryBoxCard, ScreenLoader, ScreenError, BreedPickerModal, BreedOutcomePanel, BreedParentSlot } from '@/components';
import { nftEvents, canBreed } from '@/utils';

// ─── Main screen ──────────────────────────────────────────────────────────────
/**
 * Breed screen that lets the user select two compatible NFTs and trigger
 * the `breed-nfts` Edge Function to mint a new child NFT.
 * Displays a probability breakdown and the resulting child NFT on success.
 */export default memo(function Breed() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { breedNFTs, loading: breedLoading, error: breedError } = useBreedNFT();
  const { poopBalance } = useWallet();

  const [parent1, setParent1] = useState<NFT | null>(null);
  const [parent2, setParent2] = useState<NFT | null>(null);
  const [pickerSlot, setPickerSlot] = useState<1 | 2 | null>(null);
  const [breedResult, setBreedResult] = useState<MysteryBox | null>(null);
  const [resultParent1Url, setResultParent1Url] = useState<string | null>(null);
  const [resultParent2Url, setResultParent2Url] = useState<string | null>(null);

  // When parent1 changes, clear parent2 if it is no longer compatible
  const handleSetParent1 = (nft: NFT) => {
    setParent1(nft);
    if (parent2 && (parent2.id === nft.id || !canBreed(nft.rarity, parent2.rarity))) {
      setParent2(null);
    }
  };

  const handleBreed = async () => {
    if (!parent1 || !parent2) return;
    setResultParent1Url(parent1.image_url);
    setResultParent2Url(parent2.image_url);
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
    setResultParent1Url(null);
    setResultParent2Url(null);
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return <ScreenLoader title="Breed" />;
  if (error)   return <ScreenError title="Breed" message={`Error: ${error}`} onRetry={refetch} />;

  if (nfts.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Breed</Text>

        {/* Wallet balance + cost */}
        <Text style={styles.description}>
          {poopBalance !== null
            ? `💩 Balance: ${poopBalance} POOP  ·  Cost: ${POOP_BREED_COST} POOP`
            : `Cost: ${POOP_BREED_COST} POOP`}
        </Text>
        <Text style={styles.description}>You need at least 2 NFTs to breed</Text>
      </View>
    );
  }

  const canBreedNow = Boolean(parent1 && parent2);
  const hasEnoughPoop = poopBalance === null || poopBalance >= POOP_BREED_COST;

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
          lockedRarity={parent2?.rarity}
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

            {!hasEnoughPoop && (
              <Text style={styles.breedError}>
                Insufficient POOP — you need {POOP_BREED_COST} POOP to breed.
              </Text>
            )}

            {/* ── Breed button ──────────────────────────────────────────────── */}
            <TouchableOpacity
              style={[
                styles.breedButton,
                (!canBreedNow || breedLoading || !hasEnoughPoop) && styles.breedButtonDisabled,
              ]}
              onPress={handleBreed}
              disabled={!canBreedNow || breedLoading || !hasEnoughPoop}
            >
              <Text style={styles.breedButtonText}>
                {breedLoading ? 'Breeding…' : `Breed (${POOP_BREED_COST} POOP)`}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* ── Result ───────────────────────────────────────────────────── */
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🎉 Mystery Box Earned!</Text>

            {/* Parents summary */}
            <View style={styles.resultParentsRow}>
              {resultParent1Url && <Image source={{ uri: resultParent1Url }} style={styles.resultParentThumb} />}
              <Text style={styles.resultCross}>×</Text>
              {resultParent2Url && <Image source={{ uri: resultParent2Url }} style={styles.resultParentThumb} />}
              <Text style={styles.resultArrow}>→</Text>
            </View>

            {/* Mystery box result */}
            <MysteryBoxCard box={breedResult} />

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Breed Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
});
