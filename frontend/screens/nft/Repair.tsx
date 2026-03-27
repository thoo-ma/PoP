import { Text, View, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useState } from 'react';
import { Button, Dialog, ScrollShadow, Slider, cn } from 'heroui-native';
import { screenContainer, scrollContent, nftPickerButton, badgeLabel, nftDetailCard, overlayBadge, typeBadge, dialogBody, infoBox } from '@/styles';
import { NFTProperties, ScreenLoader, ScreenError, NFTSelector, DegenBar } from '@/components';
import { useUserNFTs, useRepairNFT, useWallet } from '@/hooks';
import { MAX_ENERGY, repairCost } from '@pop/shared';
import { calcReducedCost } from '@pop/shared/degenBar';
import { nftEvents, formatDisplayName } from '@/utils';
import { useGameConfig } from '@/store/gameConfigStore';

/**
 * Repair screen for restoring an NFT's energy using the Energy slider.
 * Persists the updated energy value via `updateEnergy` and emits an
 * `nftUpdated` event so other screens stay in sync.
 */
export default memo(function Repair() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { repairNFT, loading: updateLoading, insufficientPoopError, bustedResult } = useRepairNFT();
  const { poopBalance } = useWallet();
  const { config: cfg } = useGameConfig();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [repairAmount, setRepairAmount] = useState(0);
  const [degenPercent, setDegenPercent] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);
  const [repairedEnergy, setRepairedEnergy] = useState<number | null>(null);
  const [poopSpent, setPoopSpent] = useState<number | null>(null);

  // ── Alert dialog state ─────────────────────────────────────
  const [alertDialog, setAlertDialog] = useState<{ title: string; message: string } | null>(null);

  const selectedNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null;
  const currentEnergy = selectedNFT?.energy || 0;
  const maxRepairPossible = MAX_ENERGY - currentEnergy;
  // Cost in POOP, recalculated whenever the slider or selected NFT changes
  const poopCost = selectedNFT ? repairCost(selectedNFT.level, selectedNFT.rarity, Math.round(repairAmount), MAX_ENERGY, cfg.currency) : 0;
  const detailStyles = nftDetailCard();

  const handleSelectNFT = () => {
    if (nfts.length === 0) return;
    // Start on the first NFT with energy < 100, or index 0
    const idx = nfts.findIndex(nft => nft.energy < 100);
    setSelectedIndex(idx >= 0 ? idx : 0);
    setIsRepaired(false);
    setRepairAmount(0);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(i => ((i as number) - 1 + nfts.length) % nfts.length);
    setIsRepaired(false);
    setRepairAmount(0);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(i => ((i as number) + 1) % nfts.length);
    setIsRepaired(false);
    setRepairAmount(0);
  };

  const handleRepair = async () => {
    if (!selectedNFT || repairAmount === 0) return;
    
    const newEnergy = currentEnergy + Math.round(repairAmount);
    const result = await repairNFT(selectedNFT.id, newEnergy, degenPercent);
    
    if (result) {
      setRepairedEnergy(result.energy);
      setPoopSpent(result.poop_spent);
      setIsRepaired(true);
      setRepairAmount(0);
      await refetch();
      nftEvents.emit(); // Notify other screens
    } else if (insufficientPoopError) {
      setAlertDialog({
        title: 'Insufficient POOP',
        message: `You need ${insufficientPoopError.poop_required} POOP to repair. You have ${insufficientPoopError.poop_balance} POOP.`,
      });
    } else {
      setAlertDialog({ title: 'Repair Failed', message: 'Failed to repair NFT. Please try again.' });
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setRepairAmount(0);
    setDegenPercent(0);
    setIsRepaired(false);
    setRepairedEnergy(null);
    setPoopSpent(null);
  };

  if (loading) {
    return <ScreenLoader title="Repair" />;
  }

  if (error) {
    return <ScreenError title="Repair" message={`Error: ${error}`} onRetry={refetch} />;
  }

  return (
    <>
      <View className={screenContainer({ bg: 'default', padTop: 'md' })}>

        <ScrollShadow LinearGradientComponent={LinearGradient}>
          <ScrollView
            contentContainerClassName={cn(scrollContent({ padding: 'md', bottomPad: 'md' }), 'items-center')}
            showsVerticalScrollIndicator={false}
          >
          {selectedIndex === null ? (
            <Button
              variant="ghost"
              onPress={handleSelectNFT}
              isDisabled={nfts.length === 0}
              className={nftPickerButton()}
            >
              <Text className="text-[40px] text-muted mb-3">+</Text>
              <Button.Label className="text-base text-muted font-semibold">
                {nfts.length === 0 ? 'No NFTs Available' : 'Select NFT from Vault'}
              </Button.Label>
            </Button>
          ) : (
            <>
              {/* NFT Carousel Selector */}
              {!isRepaired && <NFTSelector
                current={(selectedIndex as number) + 1}
                total={nfts.length}
                onPrev={handlePrev}
                onNext={handleNext}
                className="mt-5 mb-1"
              />}
              {/* Selected NFT Card */}
              {!isRepaired && selectedNFT && (
                <View
                  className={cn(detailStyles.root(), 'w-[280px] bg-surface mt-5 mb-6 border-border')}
                >
                  <View className={detailStyles.imageWrap()}>
                    <Image
                      source={{ uri: selectedNFT.image_url }}
                      className="w-full h-[280px] bg-default"
                      resizeMode="cover"
                    />
                    <View className={cn(overlayBadge({ position: 'topLeft' }), 'bg-indigo-500')}>
                      <Text className={cn(badgeLabel(), 'tracking-wide')}>Lv {selectedNFT.level}</Text>
                    </View>
                    <View
                      className={cn(overlayBadge({ position: 'bottomLeft' }), typeBadge({ type: selectedNFT.type }))}
                    >
                      <Text className={cn(badgeLabel({ size: 'sm' }), 'tracking-wide')}>{selectedNFT.type.toUpperCase()}</Text>
                    </View>
                    <View className={cn(overlayBadge({ position: 'topRight' }), 'bg-emerald-500/95')}>
                      <Text className={cn(badgeLabel(), 'tracking-wide')}>
                        Energy: {currentEnergy + Math.round(repairAmount)}%
                      </Text>
                    </View>
                  </View>

                  <View className={cn(detailStyles.content(), 'p-4')}>
                    <Text className={cn(detailStyles.title(), 'text-foreground mb-3')}>{formatDisplayName(selectedNFT.name)}</Text>

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

              {currentEnergy < MAX_ENERGY && !isRepaired && (
                <>
                  {/* Repair Controls */}
                  <DegenBar
                    baseCost={poopCost}
                    onDegenChange={setDegenPercent}
                    disabled={updateLoading}
                  />

                  <View className={cn(infoBox(), 'mb-5')}>
                    <Text className="text-base font-bold text-foreground mb-3">Repair Amount</Text>
                    <View className="items-center mb-2">
                      <Text className="text-[32px] font-bold text-green-600">+{Math.round(repairAmount)}%</Text>
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

                  {/* Bust feedback */}
                  {bustedResult && (
                    <View className="w-full mb-3 p-4 rounded-xl bg-red-500/10 border border-red-500 items-center">
                      <Text className="text-2xl font-bold text-red-500 mb-1">BUST 💀</Text>
                      <Text className="text-sm text-foreground-500">
                        You lost {bustedResult.poop_spent} POOP — better luck next time!
                      </Text>
                    </View>
                  )}

                  {/* Repair Button */}
                  <Button
                    variant="primary"
                    onPress={handleRepair}
                    isDisabled={repairAmount === 0 || updateLoading || (poopBalance !== null && poopBalance < poopCost)}
                    className="w-full"
                  >
                    {updateLoading
                      ? 'Repairing...'
                      : (poopBalance !== null && poopBalance < poopCost)
                      ? `Need ${poopCost} POOP`
                      : degenPercent > 0
                      ? `Repair — ~~${poopCost}~~ ${calcReducedCost(poopCost, degenPercent, cfg.degen_bar)} POOP`
                      : `Repair (${poopCost} POOP)`}
                  </Button>
                </>
              )}

              {isRepaired && (
                <View className="items-center mt-8 bg-green-100 p-6 rounded-2xl border-2 border-green-500">
                  <Text className="text-2xl font-bold text-green-600 mb-5">✓ Repair Complete!</Text>
                  {repairedEnergy !== null && (
                    <Text className="text-2xl font-bold text-green-600 mb-5">Energy: {repairedEnergy}%</Text>
                  )}
                  {poopSpent !== null && (
                    <Text className="text-2xl font-bold text-green-600 mb-5">-{poopSpent} POOP spent</Text>
                  )}
                  <Button variant="outline" onPress={handleReset} className="w-full">
                    Repair Another NFT
                  </Button>
                </View>
              )}

              {currentEnergy === MAX_ENERGY && !isRepaired && (
                <View className="items-center mt-6">
                  <Text className="text-lg font-semibold text-foreground mb-6 text-center">This NFT is at full energy!</Text>
                  <Button variant="outline" onPress={handleReset} className="w-full">
                    Select Another NFT
                  </Button>
                </View>
              )}
            </>
          )}
          </ScrollView>
          </ScrollShadow>
        </View>

      <Dialog isOpen={alertDialog !== null} onOpenChange={(open) => { if (!open) setAlertDialog(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className={dialogBody()}>
              <Dialog.Title>{alertDialog?.title ?? ''}</Dialog.Title>
              <Dialog.Description>{alertDialog?.message ?? ''}</Dialog.Description>
            </View>
            <View className="flex-row justify-end">
              <Button variant="primary" size="sm" onPress={() => setAlertDialog(null)}>
                OK
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
});
