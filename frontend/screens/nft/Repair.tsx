import { MAX_ENERGY, repairCost } from '@pop/shared'
import { calcReducedCost } from '@pop/shared/degenBar'
import { useScrollToTop } from '@react-navigation/native'
import { Button, cn, Dialog, Slider } from 'heroui-native'
import { memo, useRef, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { DegenBar, NFTProperties, NFTSelector, ScreenError, ScreenLoader } from '@/components'
import { useRepairNFT, useUserNFTs, useWallet } from '@/hooks'
import {
  badgeLabel,
  bustMessage,
  costStrikethrough,
  dialogBody,
  dialogFooter,
  infoBox,
  nftDetailCard,
  nftPickerButton,
  nftPickerPlaceholder,
  overlayBadge,
  repairAmountBox,
  repairFullEnergy,
  repairSuccess,
  screenContainer,
  scrollContent,
  tactileButton,
  tactileButtonText,
  typeBadge,
} from '@/styles'
import { formatDisplayName } from '@/utils'

/**
 * Repair screen for restoring an NFT's energy using the Energy slider.
 * Persists the updated energy value via `updateEnergy` and emits an
 * `nftUpdated` event so other screens stay in sync.
 */
export default memo(function Repair() {
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  const { nfts, loading, error, refetch } = useUserNFTs()
  const { repairNFT, loading: updateLoading, insufficientPoopError, bustedResult } = useRepairNFT()
  const { poopBalance } = useWallet()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [repairAmount, setRepairAmount] = useState(0)
  const [degenPercent, setDegenPercent] = useState(0)
  const [isRepaired, setIsRepaired] = useState(false)
  const [repairedEnergy, setRepairedEnergy] = useState<number | null>(null)
  const [poopSpent, setPoopSpent] = useState<number | null>(null)

  // ── Alert dialog state ─────────────────────────────────────
  const [alertDialog, setAlertDialog] = useState<{ title: string; message: string } | null>(null)

  const selectedNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null
  const currentEnergy = selectedNFT?.energy || 0
  const maxRepairPossible = MAX_ENERGY - currentEnergy
  // Cost in POOP, recalculated whenever the slider or selected NFT changes
  const poopCost = selectedNFT
    ? repairCost(selectedNFT.level, selectedNFT.rarity, Math.round(repairAmount), MAX_ENERGY)
    : 0
  const detailStyles = nftDetailCard()
  const ra = repairAmountBox()
  const rs = repairSuccess()
  const rfe = repairFullEnergy()
  const bm = bustMessage()
  const ph = nftPickerPlaceholder()

  const handleSelectNFT = () => {
    if (nfts.length === 0) return
    // Start on the first NFT with energy < 100, or index 0
    const idx = nfts.findIndex((nft) => nft.energy < 100)
    setSelectedIndex(idx >= 0 ? idx : 0)
    setIsRepaired(false)
    setRepairAmount(0)
  }

  const handlePrev = () => {
    if (selectedIndex === null) return
    setSelectedIndex((i) => ((i as number) - 1 + nfts.length) % nfts.length)
    setIsRepaired(false)
    setRepairAmount(0)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((i) => ((i as number) + 1) % nfts.length)
    setIsRepaired(false)
    setRepairAmount(0)
  }

  const handleRepair = async () => {
    if (!selectedNFT || repairAmount === 0) return

    const newEnergy = currentEnergy + Math.round(repairAmount)
    const result = await repairNFT(selectedNFT.id, newEnergy, degenPercent)

    if (result) {
      setRepairedEnergy(result.energy)
      setPoopSpent(result.poop_spent)
      setIsRepaired(true)
      setRepairAmount(0)
    } else if (insufficientPoopError) {
      setAlertDialog({
        title: 'Insufficient POOP',
        message: `You need ${insufficientPoopError.poop_required} POOP to repair. You have ${insufficientPoopError.poop_balance} POOP.`,
      })
    } else {
      setAlertDialog({
        title: 'Repair Failed',
        message: 'Failed to repair NFT. Please try again.',
      })
    }
  }

  const handleReset = () => {
    setSelectedIndex(null)
    setRepairAmount(0)
    setDegenPercent(0)
    setIsRepaired(false)
    setRepairedEnergy(null)
    setPoopSpent(null)
  }

  if (loading) {
    return <ScreenLoader title="Repair" />
  }

  if (error) {
    return <ScreenError title="Repair" message={`Error: ${error}`} onRetry={refetch} />
  }

  return (
    <>
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
                    <View className={cn(detailStyles.root(), 'w-70 bg-surface border-outline')}>
                      <View className={detailStyles.imageWrap()}>
                        <Image
                          source={{ uri: selectedNFT.image_url }}
                          className={detailStyles.image()}
                          resizeMode="cover"
                        />
                        <View
                          className={cn(overlayBadge({ position: 'topLeft' }), 'bg-badge-level')}
                        >
                          <Text className={cn(badgeLabel(), 'tracking-wide')}>
                            Lv {selectedNFT.level}
                          </Text>
                        </View>
                        <View
                          className={cn(
                            overlayBadge({ position: 'topRight' }),
                            typeBadge({ type: selectedNFT.type }),
                          )}
                        >
                          <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>
                            {selectedNFT.type.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      <View className={cn(detailStyles.content(), 'p-4')}>
                        <Text className={cn(detailStyles.title(), 'text-on-surface mb-3')}>
                          {formatDisplayName(selectedNFT.name)}
                        </Text>

                        <NFTProperties
                          efficiency={selectedNFT.efficiency}
                          resilience={selectedNFT.resilience}
                          comfort={selectedNFT.comfort}
                          luck={selectedNFT.luck}
                          energy={currentEnergy + Math.round(repairAmount)}
                          mode="compact"
                        />
                      </View>
                    </View>
                  )}

                  {isRepaired && (
                    <View className={rs.root()}>
                      <Text className={rs.text()}>Repair Complete!</Text>
                      {repairedEnergy !== null && (
                        <Text className={rs.text()}>Energy: {repairedEnergy}%</Text>
                      )}
                      {poopSpent !== null && (
                        <Text className={rs.text()}>-{poopSpent} POOP spent</Text>
                      )}
                      <Button
                        animation="disable-all"
                        onPress={handleReset}
                        className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
                      >
                        <Button.Label className={tactileButtonText({ variant: 'outline' })}>
                          Repair Another NFT
                        </Button.Label>
                      </Button>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Repair controls — only when NFT selected, energy < max, not repaired */}
            {selectedNFT && currentEnergy < MAX_ENERGY && !isRepaired && (
              <>
                <View className={cn(infoBox(), 'mb-5')}>
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

                {/* Bust feedback */}
                {bustedResult && (
                  <View className={bm.root()}>
                    <Text className={bm.title()}>BUST</Text>
                    <Text className={bm.detail()}>
                      You lost {bustedResult.poop_spent} POOP — better luck next time!
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Full energy state */}
            {currentEnergy === MAX_ENERGY && selectedNFT && !isRepaired && (
              <View className={rfe.root()}>
                <Button
                  animation="disable-all"
                  onPress={handleReset}
                  className={cn(tactileButton({ variant: 'outline' }), 'w-full')}
                >
                  <Button.Label className={tactileButtonText({ variant: 'outline' })}>
                    This NFT is at full energy!
                  </Button.Label>
                </Button>
              </View>
            )}

            {/* Repair button — always shown when not repaired and not full energy */}
            {!isRepaired && !(currentEnergy === MAX_ENERGY && selectedNFT) && (
              <Button
                variant="ghost"
                feedbackVariant="none"
                onPress={handleRepair}
                isDisabled={
                  selectedIndex === null ||
                  repairAmount === 0 ||
                  updateLoading ||
                  (poopBalance !== null && poopBalance < poopCost)
                }
                className={cn(tactileButton({ variant: 'primary' }), 'w-full')}
              >
                <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                  {updateLoading ? (
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
                variant="ghost"
                feedbackVariant="none"
                onPress={() => setAlertDialog(null)}
                className={tactileButton({ variant: 'primary', size: 'sm' })}
              >
                <Button.Label className={tactileButtonText({ variant: 'primary', size: 'sm' })}>
                  OK
                </Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
})
