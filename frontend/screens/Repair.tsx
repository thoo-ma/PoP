import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { repairStyles as styles } from '../styles';
import { MOCK_NFTS } from '../constants/mockData';
import { NFTProperties } from '../components';
import { useNFTStore } from '../hooks/useNFTStore';

export default function Repair() {
  const { updateNFTEnergy } = useNFTStore();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState(60);
  const [repairAmount, setRepairAmount] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);

  const maxEnergy = 100;
  const maxRepairPossible = maxEnergy - currentEnergy;

  const handleSelectNFT = () => {
    // Simulate NFT selection - use first NFT that's not at full energy
    const nftToRepair = MOCK_NFTS.find(nft => nft.energy && nft.energy < 100);
    if (nftToRepair) {
      setSelectedNFT(nftToRepair.id);
      setCurrentEnergy(nftToRepair.energy || 60);
      setIsRepaired(false);
    }
  };

  const selectedNFTData = MOCK_NFTS.find(nft => nft.id === selectedNFT);

  const handleRepair = () => {
    const newEnergy = currentEnergy + repairAmount;
    setCurrentEnergy(newEnergy);
    setIsRepaired(true);
    setRepairAmount(0);
    
    // Update the NFT in the store
    if (selectedNFT) {
      updateNFTEnergy(selectedNFT, newEnergy);
    }
  };

  const handleReset = () => {
    setSelectedNFT(null);
    setCurrentEnergy(60);
    setRepairAmount(0);
    setIsRepaired(false);
  };

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
          <TouchableOpacity style={styles.selectButton} onPress={handleSelectNFT}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.selectText}>Select NFT from Vault</Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Selected NFT Card */}
            <View style={styles.nftCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    selectedNFTData?.image 
                      ? (typeof selectedNFTData.image === 'string' ? { uri: selectedNFTData.image } : selectedNFTData.image)
                      : require('../assets/toilets/nitro/nitro-1.jpeg')
                  }
                  style={styles.nftImage}
                  resizeMode="cover"
                />
                <View style={styles.resilienceBadge}>
                  <Text style={styles.resilienceBadgeText}>Energy: {currentEnergy + Math.round(repairAmount)}%</Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.nftName}>{selectedNFTData?.name || `NFT #${selectedNFT}`}</Text>
                
                {selectedNFTData && (
                  <NFTProperties
                    efficiency={selectedNFTData.efficiency}
                    resilience={selectedNFTData.resilience}
                    comfort={selectedNFTData.comfort}
                    luck={selectedNFTData.luck}
                    energy={currentEnergy + Math.round(repairAmount)}
                    mode="compact"
                  />
                )}
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
                    repairAmount === 0 && styles.repairButtonDisabled
                  ]}
                  onPress={handleRepair}
                  disabled={repairAmount === 0}
                >
                  <Text style={styles.repairButtonText}>Repair</Text>
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
