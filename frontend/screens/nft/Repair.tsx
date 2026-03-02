import { Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { memo, useState } from 'react';
import { repairStyles as styles } from '@/styles';
import { NFTProperties, ScreenLoader, ScreenError, NFTSelector } from '@/components';
import { useUserNFTs, useUpdateNFT } from '@/hooks';
import { MAX_ENERGY } from '@shared';
import { nftEvents, formatDisplayName, TYPE_BADGE_STYLES } from '@/utils';
import { colors } from '@/constants';

/**
 * Repair screen for restoring an NFT's energy using the Energy slider.
 * Persists the updated energy value via `updateEnergy` and emits an
 * `nftUpdated` event so other screens stay in sync.
 */
export default memo(function Repair() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { updateEnergy, loadingUpdateEnergy: updateLoading } = useUpdateNFT();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [repairAmount, setRepairAmount] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);

  const selectedNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null;
  const currentEnergy = selectedNFT?.energy || 0;
  const maxRepairPossible = MAX_ENERGY - currentEnergy;

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
    
    const newEnergy = currentEnergy + repairAmount;
    const success = await updateEnergy(selectedNFT.id, newEnergy);
    
    if (success) {
      setIsRepaired(true);
      setRepairAmount(0);
      // Refresh the NFT list from the server so we get the authoritative energy
      // value (which may differ from our local newEnergy if the server clamps it).
      // repairedNFT is intentionally NOT set here — selectedNFT will fall back to
      // nfts[selectedIndex] which now holds fresh server data.
      await refetch();
      nftEvents.emit(); // Notify other screens
    } else {
      Alert.alert('Repair Failed', 'Failed to repair NFT. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setRepairAmount(0);
    setIsRepaired(false);
  };

  if (loading) {
    return <ScreenLoader title="Repair" />;
  }

  if (error) {
    return <ScreenError title="Repair" message={`Error: ${error}`} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repair</Text>
      <Text style={styles.description}>
        Select an NFT and restore its energy
      </Text>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            {/* NFT Carousel Selector */}
            {!isRepaired && <NFTSelector
              current={(selectedIndex as number) + 1}
              total={nfts.length}
              onPrev={handlePrev}
              onNext={handleNext}
              style={{ marginTop: 20, marginBottom: 4 }}
            />}
            {/* Selected NFT Card */}
            {!isRepaired && selectedNFT && <View style={styles.nftCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedNFT.image_url }}
                  style={styles.nftImage}
                  resizeMode="cover"
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Lv {selectedNFT.level}</Text>
                </View>
                <View style={[styles.typeBadge, TYPE_BADGE_STYLES[selectedNFT.type]]}>
                  <Text style={styles.typeBadgeText}>{selectedNFT.type.toUpperCase()}</Text>
                </View>
                <View style={styles.resilienceBadge}>
                  <Text style={styles.resilienceBadgeText}>
                    Energy: {currentEnergy + Math.round(repairAmount)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.nftName}>{formatDisplayName(selectedNFT.name)}</Text>
                
                <NFTProperties
                  efficiency={selectedNFT.efficiency}
                  resilience={selectedNFT.resilience}
                  comfort={selectedNFT.comfort}
                  luck={selectedNFT.luck}
                  energy={currentEnergy + Math.round(repairAmount)}
                  mode="compact"
                />
              </View>
            </View>}

            {currentEnergy < MAX_ENERGY && !isRepaired && (
              <>
                {/* Repair Controls */}
                <View style={styles.repairControls}>
                  <Text style={styles.sectionTitle}>Repair Amount</Text>
                  <View style={styles.sliderValueContainer}>
                    <Text style={styles.sliderValue}>+{Math.round(repairAmount)}%</Text>
                  </View>
                  <Slider
                    style={styles.slider}
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
                <TouchableOpacity
                  style={[
                    styles.repairButton,
                    (repairAmount === 0 || updateLoading) && styles.repairButtonDisabled
                  ]}
                  onPress={handleRepair}
                  disabled={repairAmount === 0 || updateLoading}
                >
                  <Text style={styles.repairButtonText}>
                    {updateLoading ? 'Repairing...' : 'Repair'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {isRepaired && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>✓ Repair Complete!</Text>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Repair Another NFT</Text>
                </TouchableOpacity>
              </View>
            )}

            {currentEnergy === MAX_ENERGY && !isRepaired && (
              <View style={styles.fullResilienceMessage}>
                <Text style={styles.fullResilienceText}>This NFT is at full energy!</Text>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Select Another NFT</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
});
