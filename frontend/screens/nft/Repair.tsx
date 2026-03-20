import { Text, View, ScrollView, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { memo, useState } from 'react';
import { Button, Dialog } from 'heroui-native';
import { NFTProperties, ScreenLoader, ScreenError, NFTSelector } from '@/components';
import { useUserNFTs, useRepairNFT, useWallet } from '@/hooks';
import { MAX_ENERGY, repairCost } from '@shared';
import { nftEvents, formatDisplayName, TYPE_BADGE_STYLES } from '@/utils';
import { useGameConfig } from '@/store/gameConfigStore';
import { colors } from '@/constants';

/**
 * Repair screen for restoring an NFT's energy using the Energy slider.
 * Persists the updated energy value via `updateEnergy` and emits an
 * `nftUpdated` event so other screens stay in sync.
 */
export default memo(function Repair() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { repairNFT, loading: updateLoading, error: repairError, insufficientPoopError } = useRepairNFT();
  const { poopBalance } = useWallet();
  const { config: cfg } = useGameConfig();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [repairAmount, setRepairAmount] = useState(0);
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
    const result = await repairNFT(selectedNFT.id, newEnergy);
    
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
      <View className="flex-1 bg-white items-center pt-[80px]">
        <Text className="text-[32px] font-bold text-center mb-3 text-gray-700">Repair</Text>
        <Text className="text-base text-center text-gray-500 mb-4">
          Select an NFT and restore its energy
        </Text>
        {/* Wallet balance */}
        {poopBalance !== null && (
          <Text className="text-base text-center text-gray-500 mb-4">💩 Balance: {poopBalance} POOP</Text>
        )}

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {selectedIndex === null ? (
            <Button
              variant="ghost"
              onPress={handleSelectNFT}
              isDisabled={nfts.length === 0}
              className="w-[240px] h-[360px] rounded-2xl border-2 border-dashed border-gray-300 flex-col mt-5"
            >
              <Text className="text-[40px] text-gray-400 mb-3">+</Text>
              <Button.Label className="text-base text-gray-500 font-semibold">
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
                style={{ marginTop: 20, marginBottom: 4 }}
              />}
              {/* Selected NFT Card */}
              {!isRepaired && selectedNFT && (
                <View
                  className="w-[280px] bg-white rounded-2xl overflow-hidden mt-5 mb-6 border border-gray-200"
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}
                >
                  <View className="relative w-full">
                    <Image
                      source={{ uri: selectedNFT.image_url }}
                      className="w-full h-[280px] bg-gray-100"
                      resizeMode="cover"
                    />
                    <View className="absolute top-3 left-3 rounded-lg px-3 py-1.5 bg-indigo-500">
                      <Text className="text-white text-xs font-bold tracking-wide">Lv {selectedNFT.level}</Text>
                    </View>
                    <View
                      className="absolute bottom-3 left-3 rounded-lg px-3 py-1.5"
                      style={{ backgroundColor: (TYPE_BADGE_STYLES[selectedNFT.type] as { backgroundColor: string }).backgroundColor }}
                    >
                      <Text className="text-white text-[11px] font-bold tracking-wide">{selectedNFT.type.toUpperCase()}</Text>
                    </View>
                    <View className="absolute top-3 right-3 rounded-lg px-3 py-1.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.95)' }}>
                      <Text className="text-white text-xs font-bold tracking-wide">
                        Energy: {currentEnergy + Math.round(repairAmount)}%
                      </Text>
                    </View>
                  </View>

                  <View className="p-4">
                    <Text className="text-lg font-bold text-gray-700 mb-3 text-center">{formatDisplayName(selectedNFT.name)}</Text>

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
                  <View className="w-full bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-200">
                    <Text className="text-base font-bold text-gray-700 mb-3">Repair Amount</Text>
                    <View className="items-center mb-2">
                      <Text className="text-[32px] font-bold text-green-600">+{Math.round(repairAmount)}%</Text>
                    </View>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={maxRepairPossible}
                      value={repairAmount}
                      onValueChange={setRepairAmount}
                      minimumTrackTintColor={colors.slider}
                      maximumTrackTintColor={colors.inactive}
                      thumbTintColor={colors.slider}
                      step={1}
                    />
                  </View>

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
                  <Text className="text-lg font-semibold text-gray-700 mb-6 text-center">This NFT is at full energy!</Text>
                  <Button variant="outline" onPress={handleReset} className="w-full">
                    Select Another NFT
                  </Button>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      <Dialog isOpen={alertDialog !== null} onOpenChange={(open) => { if (!open) setAlertDialog(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className="mb-4 gap-1.5">
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
