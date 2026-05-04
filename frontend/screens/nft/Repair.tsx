import { calcReducedCost, MAX_ENERGY, repairCost } from '@pop/shared'
import { useScrollToTop } from '@react-navigation/native'
import { memo, useCallback, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AlertFrame, DegenBar, NFTDetailCard, NFTSelector, ScreenError } from '@/components'
import { Button, cn, Skeleton, Slider, useToast } from '@/components/ui'
import { useRepairNFT, useUserNFTs, useWallet } from '@/hooks'
import {
  costStrikethrough,
  infoFrame,
  nftPickerButton,
  nftPickerSlot,
  repairAmountPanel,
  repairFullEnergy,
  repairSkeleton,
  screenContainer,
  scrollContent,
} from '@/layouts'

/**
 * Repair screen for restoring an NFT's energy using the Energy slider.
 * Calls `useRepairNFT`, which invokes the `repair-nft` Edge Function server-side.
 * On success, invalidates the React Query `userNFTs` cache — no custom events are emitted.
 */
export default memo(function Repair() {
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  const { nfts, loading, error, refetch } = useUserNFTs()
  const {
    repairNFT,
    isPending: updateLoading,
    insufficientPoopError,
    bustedResult,
  } = useRepairNFT()
  const { poopBalance } = useWallet()
  const { toast } = useToast()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [repairAmount, setRepairAmount] = useState(0)
  const [degenPercent, setDegenPercent] = useState(0)
  const [isRepaired, setIsRepaired] = useState(false)
  const [repairedEnergy, setRepairedEnergy] = useState<number | null>(null)
  const [poopSpent, setPoopSpent] = useState<number | null>(null)

  const selectedNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null
  const currentEnergy = selectedNFT?.energy || 0
  const maxRepairPossible = MAX_ENERGY - currentEnergy
  // Cost in POOP, recalculated whenever the slider or selected NFT changes
  const poopCost = selectedNFT
    ? repairCost(selectedNFT.level, selectedNFT.rarity, Math.round(repairAmount), MAX_ENERGY)
    : 0
  const ra = repairAmountPanel()
  const rfe = repairFullEnergy()
  const ph = nftPickerSlot()

  // kept: passed to NFTSelector as its onSelect handler; without useCallback it recreates on every render
  // and any component or effect that compares handler identity would see a changed reference each time.
  const handleSelectNFT = useCallback(() => {
    if (nfts.length === 0) return
    // Start on the first NFT with energy < 100, or index 0
    const idx = nfts.findIndex((nft) => nft.energy < 100)
    setSelectedIndex(idx >= 0 ? idx : 0)
    setIsRepaired(false)
    setRepairAmount(0)
  }, [nfts])

  const handlePrev = () => {
    if (selectedIndex === null || nfts.length === 0) return
    setSelectedIndex((i) => ((i as number) - 1 + nfts.length) % nfts.length)
    setIsRepaired(false)
    setRepairAmount(0)
  }

  const handleNext = () => {
    if (selectedIndex === null || nfts.length === 0) return
    setSelectedIndex((i) => ((i as number) + 1) % nfts.length)
    setIsRepaired(false)
    setRepairAmount(0)
  }

  // kept: recurses into itself inside the toast retry callback (onActionPress); without useCallback the
  // retry captures a stale closure that may reference outdated repair state (selectedNFT, repairAmount, etc.).
  const handleRepair = useCallback(async () => {
    if (!selectedNFT || repairAmount === 0) return

    const newEnergy = currentEnergy + Math.round(repairAmount)
    const result = await repairNFT(selectedNFT.id, newEnergy, degenPercent)

    if (result) {
      setRepairedEnergy(result.energy)
      setPoopSpent(result.poop_spent)
      setIsRepaired(true)
      setRepairAmount(0)
    } else if (insufficientPoopError) {
      toast.show({
        variant: 'danger',
        label: 'Insufficient POOP',
        description: `You need ${insufficientPoopError.poop_required} POOP to repair. You have ${insufficientPoopError.poop_balance} POOP.`,
      })
    } else {
      toast.show({
        variant: 'danger',
        label: 'Repair Failed',
        description: 'Failed to repair NFT. Please try again.',
        actionLabel: 'Retry',
        onActionPress: ({ hide }) => {
          hide()
          handleRepair()
        },
      })
    }
  }, [
    selectedNFT,
    repairAmount,
    currentEnergy,
    degenPercent,
    repairNFT,
    insufficientPoopError,
    toast,
  ])

  const handleReset = () => {
    setSelectedIndex(null)
    setRepairAmount(0)
    setDegenPercent(0)
    setIsRepaired(false)
    setRepairedEnergy(null)
    setPoopSpent(null)
  }

  if (loading) {
    const sk = repairSkeleton()
    return (
      <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
        <View className="w-full">
          <ScrollView
            contentContainerClassName={scrollContent({
              padding: 'md',
              bottomPad: 'default',
              align: 'center',
            })}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full items-center">
              <Skeleton className={sk.pickerButton()} />
            </View>
            <Skeleton className={sk.sliderBox()} />
            <Skeleton className={sk.button()} />
          </ScrollView>
        </View>
      </View>
    )
  }

  if (error) {
    return <ScreenError title="Repair" message={`Error: ${error}`} onRetry={refetch} />
  }

  return (
    <View className={screenContainer({ bg: 'default', padTop: 'md' })}>
      <View className="w-full">
        <ScrollView
          ref={scrollRef}
          contentContainerClassName={scrollContent({
            padding: 'md',
            bottomPad: 'default',
            align: 'center',
          })}
          showsVerticalScrollIndicator={false}
        >
          {/* NFT picker / card area */}
          <View className="w-full items-center mb-5">
            {selectedIndex === null ? (
              <Button
                variant="ghost"
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
                {/* NFT Carousel Selector */}
                {!isRepaired && (
                  <NFTSelector
                    current={(selectedIndex as number) + 1}
                    total={nfts.length}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    className="mb-3"
                  />
                )}
                {/* Selected NFT Card */}
                {!isRepaired && selectedNFT && (
                  <NFTDetailCard
                    nft={selectedNFT}
                    energy={currentEnergy + Math.round(repairAmount)}
                  />
                )}

                {isRepaired && (
                  <View className="w-full">
                    <AlertFrame
                      status="success"
                      title="Repair Complete!"
                      description={[
                        repairedEnergy !== null && `Energy: ${repairedEnergy}%`,
                        poopSpent !== null && `-${poopSpent} POOP spent`,
                      ]}
                    >
                      <Button
                        animation="disable-all"
                        variant="outline"
                        onPress={handleReset}
                        className="w-full mt-4"
                      >
                        <Button.Label>Repair Another NFT</Button.Label>
                      </Button>
                    </AlertFrame>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Bust feedback — shown regardless of selection state */}
          {bustedResult && (
            <View className="mb-4 w-full">
              <AlertFrame
                status="danger"
                title="BUST"
                description={`You lost ${bustedResult.poop_spent} POOP — better luck next time!`}
              />
            </View>
          )}

          {/* Repair controls — only when NFT selected, energy < max, not repaired */}
          {selectedNFT && currentEnergy < MAX_ENERGY && !isRepaired && (
            <>
              <View className={cn(infoFrame(), 'mb-5')}>
                <Text className={ra.title()}>Repair Amount</Text>
                <View className={ra.valueWrap()}>
                  <Text className={ra.value()}>+{Math.round(repairAmount)}%</Text>
                </View>
                <Slider
                  className="w-full"
                  minValue={0}
                  maxValue={maxRepairPossible}
                  value={repairAmount}
                  onChange={(v) => setRepairAmount(Array.isArray(v) ? (v[0] ?? 0) : v)}
                  step={1}
                  accessibilityLabel="Energy to repair"
                  accessibilityValue={{ min: 0, max: maxRepairPossible, now: repairAmount }}
                >
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider>
              </View>

              <DegenBar
                baseCost={poopCost}
                onDegenChange={setDegenPercent}
                disabled={updateLoading}
              />
            </>
          )}

          {/* Full energy state */}
          {currentEnergy === MAX_ENERGY && selectedNFT && !isRepaired && (
            <View className={rfe.root()}>
              <Button
                animation="disable-all"
                variant="outline"
                onPress={handleReset}
                className="w-full"
              >
                <Button.Label>This NFT is at full energy!</Button.Label>
              </Button>
            </View>
          )}

          {/* Repair button — always shown when not repaired and not full energy */}
          {!isRepaired && !(currentEnergy === MAX_ENERGY && selectedNFT) && (
            <Button
              variant="primary"
              onPress={handleRepair}
              isDisabled={
                selectedIndex === null ||
                repairAmount === 0 ||
                updateLoading ||
                (poopBalance !== null && poopBalance < poopCost)
              }
              className="w-full"
            >
              <Button.Label>
                {selectedIndex === null ? (
                  'Select an NFT'
                ) : updateLoading ? (
                  'Repairing...'
                ) : poopBalance !== null && poopBalance < poopCost ? (
                  `Need ${poopCost} POOP`
                ) : degenPercent > 0 ? (
                  <>
                    {'Repair — '}
                    <Text className={costStrikethrough()}>{poopCost}</Text>
                    {` ${calcReducedCost(poopCost, degenPercent)} POOP`}
                  </>
                ) : (
                  `Repair (${poopCost} POOP)`
                )}
              </Button.Label>
            </Button>
          )}
        </ScrollView>
      </View>
    </View>
  )
})
