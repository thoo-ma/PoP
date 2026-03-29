import { Text, View, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useState } from "react";
import { Button, ScrollShadow, cn } from "heroui-native";
import { screenContainer, scrollContent, errorMessage, infoBox } from "@/styles";
import { useUserNFTs, useBreedNFT, useWallet } from "@/hooks";
import type { NFT } from "@/types/nft";
import type { MysteryBox } from "@pop/shared";
import { breedCost } from "@pop/shared";
import { calcReducedCost } from "@pop/shared/degenBar";
import { useGameConfig } from "@/store/gameConfigStore";
import {
  MysteryBoxCard,
  ScreenLoader,
  ScreenError,
  BreedPickerModal,
  BreedOutcomePanel,
  BreedParentSlot,
  DegenBar,
} from "@/components";
import { nftEvents, canBreed } from "@/utils";

// ─── Main screen ──────────────────────────────────────────────────────────────
/**
 * Breed screen that lets the user select two compatible NFTs and trigger
 * the `breed-nfts` Edge Function to mint a new child NFT.
 * Displays a probability breakdown and the resulting child NFT on success.
 */ export default memo(function Breed() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { breedNFTs, loading: breedLoading, error: breedError, bustedResult } = useBreedNFT();
  const { poopBalance } = useWallet();
  const { config: cfg } = useGameConfig();

  const [parent1, setParent1] = useState<NFT | null>(null);
  const [parent2, setParent2] = useState<NFT | null>(null);
  const [pickerSlot, setPickerSlot] = useState<1 | 2 | null>(null);
  const [breedResult, setBreedResult] = useState<MysteryBox | null>(null);
  const [resultParent1Url, setResultParent1Url] = useState<string | null>(null);
  const [resultParent2Url, setResultParent2Url] = useState<string | null>(null);
  const [degenPercent, setDegenPercent] = useState(0);

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
    const newNFT = await breedNFTs(parent1.id, parent2.id, degenPercent);
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
    setDegenPercent(0);
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return <ScreenLoader title="Breed" />;
  if (error) return <ScreenError title="Breed" message={`Error: ${error}`} onRetry={refetch} />;

  if (nfts.length < 2) {
    return (
      <View className={screenContainer({ bg: "default", padTop: "md" })}>
        <View className={infoBox()}>
          <Text className="text-sm text-foreground-500 text-center">
            You need at least two NFTs in your wallet to breed. Acquire or mint another NFT, then
            come back to start breeding.
          </Text>
        </View>
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
    <View className={screenContainer({ bg: "default", padTop: "md" })}>
      <ScrollShadow LinearGradientComponent={LinearGradient}>
        <ScrollView
          contentContainerClassName={cn(
            scrollContent({ padding: "md", bottomPad: "md" }),
            "items-center w-full",
          )}
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
                  <Text className="text-[26px] font-bold text-foreground">×</Text>
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
                <View className={cn(infoBox({ border: "dashed" }), "mb-6")}>
                  <Text className="text-[13px] text-muted text-center leading-5">
                    Select both parents to see outcome probabilities
                  </Text>
                </View>
              )}
              {/* ── Degen Bar ────────────────────────────────────────── */}
              {totalBreedCost !== null && (
                <DegenBar
                  baseCost={totalBreedCost}
                  onDegenChange={setDegenPercent}
                  disabled={breedLoading}
                />
              )}

              {/* ── Bust feedback ──────────────────────────────────────── */}
              {bustedResult && (
                <View className="w-full mb-3 p-4 rounded-xl bg-red-500/10 border border-red-500 items-center">
                  <Text className="text-2xl font-bold text-red-500 mb-1">BUST 💀</Text>
                  <Text className="text-sm text-foreground-500">
                    You lost {bustedResult.poop_spent} POOP — better luck next time!
                  </Text>
                </View>
              )}
              {/* ── Breed error ───────────────────────────────────────────── */}
              {breedError && <Text className={errorMessage()}>{breedError}</Text>}

              {atBreedLimit && (
                <Text className={errorMessage()}>
                  One of the selected NFTs has reached its max breed count (
                  {cfg.currency.BREED_MAX_COUNT}) and cannot be bred again.
                </Text>
              )}

              {!hasEnoughPoop && (
                <Text className={errorMessage()}>
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
                {breedLoading ? (
                  "Breeding…"
                ) : degenPercent > 0 && totalBreedCost !== null ? (
                  <Text>
                    Breed —{" "}
                    <Text className="line-through text-foreground-500">{totalBreedCost}</Text>{" "}
                    {calcReducedCost(totalBreedCost, degenPercent, cfg.degen_bar)} POOP
                  </Text>
                ) : totalBreedCost !== null ? (
                  `Breed (${totalBreedCost} POOP)`
                ) : (
                  "Breed"
                )}
              </Button>
            </>
          ) : (
            /* ── Result ───────────────────────────────────────────────────── */
            <View className="items-center w-full">
              <Text className="text-[26px] font-bold text-foreground mb-5 text-center">
                🎉 Mystery Box Earned!
              </Text>

              {/* Parents summary */}
              <View className="flex-row items-center mb-5 gap-2">
                {resultParent1Url && (
                  <Image
                    source={{ uri: resultParent1Url }}
                    className="w-[52px] h-[52px] rounded-lg border border-border"
                  />
                )}
                <Text className="text-lg text-muted font-semibold">×</Text>
                {resultParent2Url && (
                  <Image
                    source={{ uri: resultParent2Url }}
                    className="w-[52px] h-[52px] rounded-lg border border-border"
                  />
                )}
                <Text className="text-[22px] text-foreground font-bold">→</Text>
              </View>

              {/* Mystery box result */}
              <MysteryBoxCard box={breedResult} />

              <Button variant="primary" onPress={handleReset} className="w-full">
                Breed Again
              </Button>
            </View>
          )}
        </ScrollView>
      </ScrollShadow>
    </View>
  );
});
