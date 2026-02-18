import { Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState, useEffect } from 'react';
import { repairStyles as styles } from '../styles';
import { NFTProperties, ScreenLoader, ScreenError } from '../components';
import { useUserNFTs, useUpdateNFT } from '../hooks';
import type { NFT } from '../types';
import { nftEvents } from '../utils';

export default function Repair() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { updateEnergy, loading: updateLoading } = useUpdateNFT();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [repairAmount, setRepairAmount] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);

  const maxEnergy = 100;
  const currentEnergy = selectedNFT?.energy || 0;
  const maxRepairPossible = maxEnergy - currentEnergy;

  const handleSelectNFT = () => {
    // Find first NFT that's not at full energy
    const nftToRepair = nfts.find(nft => nft.energy < 100);
    if (nftToRepair) {
      setSelectedNFT(nftToRepair);
      setIsRepaired(false);
      setRepairAmount(0);
    } else {
      Alert.alert('All NFTs at Full Energy', 'All your NFTs are already at full energy!');
    }
  };

  const handleRepair = async () => {
    if (!selectedNFT || repairAmount === 0) return;
    
    const newEnergy = currentEnergy + repairAmount;
    const success = await updateEnergy(selectedNFT.id, newEnergy);
    
    if (success) {
      setIsRepaired(true);
      setRepairAmount(0);
      // Refresh NFT list to show updated energy
      await refetch();
      nftEvents.emit(); // Notify other screens
      // Update selected NFT with new energy value
      const updatedNFT = { ...selectedNFT, energy: newEnergy };
      setSelectedNFT(updatedNFT);
    } else {
      Alert.alert('Repair Failed', 'Failed to repair NFT. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedNFT(null);
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
        {!selectedNFT ? (
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
            {/* Selected NFT Card */}
            <View style={styles.nftCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedNFT.image }}
                  style={styles.nftImage}
                  resizeMode="cover"
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Lv {selectedNFT.level}</Text>
                </View>
                <View style={[styles.tierBadge, styles[`${selectedNFT.tier}Badge`]]}>
                  <Text style={styles.tierBadgeText}>{selectedNFT.tier.toUpperCase()}</Text>
                </View>
                <View style={styles.resilienceBadge}>
                  <Text style={styles.resilienceBadgeText}>
                    Energy: {currentEnergy + Math.round(repairAmount)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.nftName}>{selectedNFT.name}</Text>
                
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

            {currentEnergy < maxEnergy && !isRepaired && (
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
                    minimumTrackTintColor="#1e293b"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#1e293b"
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

            {currentEnergy === maxEnergy && !isRepaired && (
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
}
