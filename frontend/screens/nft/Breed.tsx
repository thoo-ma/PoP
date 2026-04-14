import type { MysteryBox } from '@pop/shared'
import { BREED_MAX_COUNT, breedCost, calcReducedCost } from '@pop/shared'
import { useScrollToTop } from '@react-navigation/native'
import { Button, cn } from 'heroui-native'
import { memo, useRef, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import {
  BreedOutcomePanel,
  BreedParentSlot,
  BreedPickerModal,
  DegenBar,
  MysteryBoxCard,
  ScreenError,
  ScreenLoader,
} from '@/components'
import { useBreedNFT, useUserNFTs, useWallet } from '@/hooks'
import {
  breedInfoText,
  breedResultSection,
  costStrikethrough,
  errorMessage,
  infoBox,
  parentSlotsRow,
  screenContainer,
  scrollContent,
  tactileButton,
  tactileButtonText,
} from '@/styles'
import type { NFT } from '@/types/nft'
import { canBreed } from '@/utils'

// ─── Main screen ──────────────────────────────────────────────────────────────
/**
 * Breed screen that lets the user select two compatible NFTs and trigger
 * the `breed-nfts` Edge Function to mint a new child NFT.
 * Displays a probability breakdown and the resulting child NFT on success.
 */ export default memo(function Breed() {
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  const { nfts, loading, error, refetch } = useUserNFTs()
  const { breedNFTs, loading: breedLoading, error: breedError, bustedResult } = useBreedNFT()
  const { poopBalance } = useWallet()

  const [parent1, setParent1] = useState<NFT | null>(null)
  const [parent2, setParent2] = useState<NFT | null>(null)
  const [pickerSlot, setPickerSlot] = useState<1 | 2 | null>(null)
  const [breedResult, setBreedResult] = useState<MysteryBox | null>(null)
  const [resultParent1Url, setResultParent1Url] = useState<string | null>(null)
  const [resultParent2Url, setResultParent2Url] = useState<string | null>(null)
  const [degenPercent, setDegenPercent] = useState(0)

  // When parent1 changes, clear parent2 if it is no longer compatible
  const handleSetParent1 = (nft: NFT) => {
    setParent1(nft)
    if (parent2 && (parent2.id === nft.id || !canBreed(nft.rarity, parent2.rarity))) {
      setParent2(null)
    }
  }

  const handleBreed = async () => {
    if (!parent1 || !parent2) return
    setResultParent1Url(parent1.image_url)
    setResultParent2Url(parent2.image_url)
    const newNFT = await breedNFTs(parent1.id, parent2.id, degenPercent)
    if (newNFT) {
      setBreedResult(newNFT)
    }
    // Error is surfaced inline — no Alert
  }

  const handleReset = () => {
    setParent1(null)
    setParent2(null)
    setBreedResult(null)
    setResultParent1Url(null)
    setResultParent2Url(null)
    setDegenPercent(0)
  }

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return <ScreenLoader title="Breed" />
  if (error) return <ScreenError title="Breed" message={`Error: ${error}`} onRetry={refetch} />

  if (nfts.length < 2) {
    return (
      <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
        <View className={infoBox()}>
          <Text className={breedInfoText()}>
            You need at least two NFTs in your wallet to breed. Acquire or mint another NFT, then
            come back to start breeding.
          </Text>
        </View>
      </View>
    )
  }

  const canBreedNow = Boolean(parent1 && parent2)

  // Dynamic cost: sum of each parent's individual breedCost, or null when not both selected.
  const totalBreedCost: number | null =
    parent1 && parent2
      ? breedCost(parent1.breed_count ?? 0, parent1.rarity) +
        breedCost(parent2.breed_count ?? 0, parent2.rarity)
      : null

  // True if either selected parent has hit the breed cap.
  const atBreedLimit =
    (parent1 !== null && (parent1.breed_count ?? 0) >= BREED_MAX_COUNT) ||
    (parent2 !== null && (parent2.breed_count ?? 0) >= BREED_MAX_COUNT)

  const hasEnoughPoop =
    poopBalance === null || totalBreedCost === null || poopBalance >= totalBreedCost

  // ── Render ────────────────────────────────────────────────────────────────
  const slotsRow = parentSlotsRow()
  const result = breedResultSection()
  return (
    <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
      <BreedPickerModal
        visible={pickerSlot === 1}
        allNFTs={nfts}
        lockedId={parent2?.id}
        lockedRarity={parent2?.rarity}
        onSelect={handleSetParent1}
        onClose={() => setPickerSlot(null)}
      />
      <BreedPickerModal
        visible={pickerSlot === 2}
        allNFTs={nfts}
        lockedId={parent1?.id}
        lockedRarity={parent1?.rarity}
        onSelect={setParent2}
        onClose={() => setPickerSlot(null)}
      />
      <View className="w-full flex-1">
        <ScrollView
          ref={scrollRef}
          contentContainerClassName={scrollContent({
            padding: 'md',
            bottomPad: 'default',
            align: 'center',
          })}
          showsVerticalScrollIndicator={false}
        >
          {!breedResult ? (
            <>
              {/* ── Parent slots ──────────────────────────────────────────── */}
              <View className={slotsRow.root()}>
                <BreedParentSlot
                  nft={parent1}
                  label="Choose Parent 1"
                  onPress={() => setPickerSlot(1)}
                />
                <View className={slotsRow.separator()}>
                  <Text className={slotsRow.separatorText()}>×</Text>
                </View>
                <BreedParentSlot
                  nft={parent2}
                  label="Choose Parent 2"
                  onPress={() => setPickerSlot(2)}
                />
              </View>

              {/* ── Outcome probabilities ─────────────────────────────────── */}
              {parent1 && parent2 ? (
                <BreedOutcomePanel r1={parent1.rarity} r2={parent2.rarity} />
              ) : (
                <View className={cn(infoBox(), 'mb-6 items-center')}>
                  <Text className={breedInfoText({ size: 'hint' })}>
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
                <ScreenError
                  title="BUST"
                  message={`You lost ${bustedResult.poop_spent} POOP — better luck next time!`}
                />
              )}
              {/* ── Breed error ───────────────────────────────────────────── */}
              {breedError && <Text className={errorMessage()}>{breedError}</Text>}

              {atBreedLimit && (
                <Text className={errorMessage()}>
                  One of the selected NFTs has reached its max breed count ({BREED_MAX_COUNT}) and
                  cannot be bred again.
                </Text>
              )}

              {!hasEnoughPoop && (
                <ScreenError
                  title="Insufficient POOP"
                  message={`You need ${totalBreedCost} POOP to breed.`}
                />
              )}

              {/* ── Breed button ──────────────────────────────────────────────── */}
              <Button
                variant="ghost"
                feedbackVariant="none"
                onPress={handleBreed}
                isDisabled={!canBreedNow || breedLoading || !hasEnoughPoop || atBreedLimit}
                className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
              >
                <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                  {breedLoading ? (
                    'Breeding…'
                  ) : degenPercent > 0 && totalBreedCost !== null ? (
                    <>
                      {'Breed — '}
                      <Text className={costStrikethrough()}>{totalBreedCost}</Text>
                      {` ${calcReducedCost(totalBreedCost, degenPercent)} POOP`}
                    </>
                  ) : totalBreedCost !== null ? (
                    `Breed (${totalBreedCost} POOP)`
                  ) : (
                    'Breed'
                  )}
                </Button.Label>
              </Button>
            </>
          ) : (
            /* ── Result ───────────────────────────────────────────────────── */
            <View className={result.root()}>
              <Text className={result.title()}>Mystery Box Earned!</Text>

              {/* Parents summary */}
              <View className={result.parentsRow()}>
                {resultParent1Url && (
                  <Image source={{ uri: resultParent1Url }} className={result.parentImage()} />
                )}
                <Text className={result.multiplyText()}>×</Text>
                {resultParent2Url && (
                  <Image source={{ uri: resultParent2Url }} className={result.parentImage()} />
                )}
                <Text className={result.arrowText()}>→</Text>
              </View>

              {/* Mystery box result */}
              <MysteryBoxCard
                rarity={breedResult.rarity}
                box={breedResult}
                imageUrl={breedResult.image_url}
              />

              <Button
                animation="disable-all"
                onPress={handleReset}
                className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
              >
                <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                  Breed Again
                </Button.Label>
              </Button>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
})
