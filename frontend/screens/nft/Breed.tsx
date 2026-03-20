import { Text, View, Image, ScrollView } from 'react-native';
import { memo, useState } from 'react';
import { Button } from 'heroui-native';
import { useUserNFTs, useBreedNFT, useWallet } from '@/hooks';
import type { NFT } from '@/types/nft';
import type { MysteryBox } from '@shared';
import { breedCost } from '@shared';
import { useGameConfig } from '@/store/gameConfigStore';
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
  const { config: cfg } = useGameConfig();

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
      <View className="flex-1 bg-white items-center pt-[80px]">
        <Text className="text-[32px] font-bold text-center mb-3 text-gray-700">Breed</Text>

        {/* Wallet balance + cost */}
        <Text className="text-base text-center text-gray-500 mb-6">
          {poopBalance !== null
            ? `💩 Balance: ${poopBalance} POOP  ·  Cost: from 100 POOP (scales with rarity & breed count)`
            : 'Cost: from 100 POOP (scales with rarity & breed count)'}
        </Text>
        <Text className="text-base text-center text-gray-500 mb-6">You need at least 2 NFTs to breed</Text>
      </View>
    );
  }

  const canBreedNow = Boolean(parent1 && parent2);

  // Dynamic cost: sum of each parent's individual breedCost, or null when not both selected.
  const totalBreedCost: number | null =
    parent1 && parent2
      ? breedCost(parent1.breed_count ?? 0, parent1.rarity, cfg.currency) +
        breedCost(parent2.breed_count ?? 0, parent2.rarity, cfg.currency)
      : null;

  // True if either selected parent has hit the breed cap.
  const atBreedLimit =
    (parent1 !== null && (parent1.breed_count ?? 0) >= cfg.currency.BREED_MAX_COUNT) ||
    (parent2 !== null && (parent2.breed_count ?? 0) >= cfg.currency.BREED_MAX_COUNT);

  const hasEnoughPoop =
    poopBalance === null || totalBreedCost === null || poopBalance >= totalBreedCost;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-white items-center pt-[80px]">
      <Text className="text-[32px] font-bold text-center mb-3 text-gray-700">Breed</Text>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, alignItems: 'center', width: '100%' }}
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
            <View className="flex-row items-stretch justify-center mb-6 w-full">
              <BreedParentSlot
                nft={parent1}
                label="Choose Parent 1"
                onPress={() => setPickerSlot(1)}
              />
              <View className="w-[36px] justify-center items-center">
                <Text className="text-[26px] font-bold text-gray-700">×</Text>
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
              <View className="w-full bg-gray-50 rounded-[14px] border border-dashed border-gray-200 p-5 items-center mb-6">
                <Text className="text-[13px] text-gray-500 text-center leading-5">
                  Select both parents to see outcome probabilities
                </Text>
              </View>
            )}

            {/* ── Breed error ───────────────────────────────────────────── */}
            {breedError && (
              <Text className="text-[13px] text-red-600 text-center mb-3 px-2">{breedError}</Text>
            )}

            {atBreedLimit && (
              <Text className="text-[13px] text-red-600 text-center mb-3 px-2">
                One of the selected NFTs has reached its max breed count ({cfg.currency.BREED_MAX_COUNT}) and cannot be bred again.
              </Text>
            )}

            {!hasEnoughPoop && (
              <Text className="text-[13px] text-red-600 text-center mb-3 px-2">
                Insufficient POOP — you need {totalBreedCost} POOP to breed.
              </Text>
            )}

            {/* ── Breed button ──────────────────────────────────────────────── */}
            <Button
              variant="primary"
              onPress={handleBreed}
              isDisabled={!canBreedNow || breedLoading || !hasEnoughPoop || atBreedLimit}
              className="w-full"
            >
              {breedLoading
                ? 'Breeding…'
                : totalBreedCost !== null
                  ? `Breed (${totalBreedCost} POOP)`
                  : 'Breed'}
            </Button>
          </>
        ) : (
          /* ── Result ───────────────────────────────────────────────────── */
          <View className="items-center w-full">
            <Text className="text-[26px] font-bold text-gray-700 mb-5 text-center">🎉 Mystery Box Earned!</Text>

            {/* Parents summary */}
            <View className="flex-row items-center mb-5 gap-2">
              {resultParent1Url && <Image source={{ uri: resultParent1Url }} className="w-[52px] h-[52px] rounded-lg border border-gray-200" />}
              <Text className="text-lg text-gray-500 font-semibold">×</Text>
              {resultParent2Url && <Image source={{ uri: resultParent2Url }} className="w-[52px] h-[52px] rounded-lg border border-gray-200" />}
              <Text className="text-[22px] text-gray-700 font-bold">→</Text>
            </View>

            {/* Mystery box result */}
            <MysteryBoxCard box={breedResult} />

            <Button variant="primary" onPress={handleReset} className="w-full">
              Breed Again
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
});
