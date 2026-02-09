import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { repairStyles as styles } from '../styles';
import { MOCK_NFTS } from '../constants/mockData';
import { NFTProperties } from '../components';
import { useNFTStore } from '../hooks/useNFTStore';

export default function Repair() {
  const { updateNFTResilience } = useNFTStore();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [currentResilience, setCurrentResilience] = useState(60);
  const [repairAmount, setRepairAmount] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);

  const maxResilience = 100;
  const maxRepairPossible = maxResilience - currentResilience;

  const handleSelectNFT = () => {
    // Simulate NFT selection - use first NFT that's not at full resilience
    const nftToRepair = MOCK_NFTS.find(nft => nft.resilience && nft.resilience < 100);
    if (nftToRepair) {
      setSelectedNFT(nftToRepair.id);
      setCurrentResilience(nftToRepair.resilience || 60);
      setIsRepaired(false);
    }
  };

  const selectedNFTData = MOCK_NFTS.find(nft => nft.id === selectedNFT);

  const handleRepair = () => {
    const newResilience = currentResilience + repairAmount;
    setCurrentResilience(newResilience);
    setIsRepaired(true);
    setRepairAmount(0);
    
    // Update the NFT in the store
    if (selectedNFT) {
      updateNFTResilience(selectedNFT, newResilience);
    }
  };

  const handleReset = () => {
    setSelectedNFT(null);
    setCurrentResilience(60);
    setRepairAmount(0);
    setIsRepaired(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repair</Text>
      <Text style={styles.description}>
        Select an NFT and restore its resilience
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
                  <Text style={styles.resilienceBadgeText}>Resilience: {currentResilience + Math.round(repairAmount)}%</Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.nftName}>{selectedNFTData?.name || `NFT #${selectedNFT}`}</Text>
                
                {selectedNFTData && (
                  <NFTProperties
                    efficiency={selectedNFTData.efficiency}
                    resilience={currentResilience + Math.round(repairAmount)}
                    comfort={selectedNFTData.comfort}
                    luck={selectedNFTData.luck}
                    mode="compact"
                  />
                )}
              </View>
            </View>

            {currentResilience < maxResilience && !isRepaired && (
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

            {currentResilience === maxResilience && !isRepaired && (
              <View style={styles.fullResilienceMessage}>
                <Text style={styles.fullResilienceText}>This NFT is at full resilience!</Text>
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
