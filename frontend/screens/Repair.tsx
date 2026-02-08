import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { repairStyles as styles } from '../styles';
import { MOCK_NFTS } from '../constants/mockData';
import NFTProperties from '../components/NFTProperties';
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
            {/* Selected NFT */}
            <View style={styles.nftCard}>
              <Image
                source={{ uri: selectedNFTData?.image || 'https://via.placeholder.com/200/9B59B6' }}
                style={styles.nftImage}
                resizeMode="cover"
              />
              <Text style={styles.nftName}>{selectedNFTData?.name || `NFT #${selectedNFT}`}</Text>
            </View>

            {/* All Properties Display */}
            {selectedNFTData && (
              <View style={styles.propertiesSection}>
                <Text style={styles.sectionTitle}>NFT Properties</Text>
                <View style={styles.staticPropertiesContainer}>
                  <View style={styles.staticPropertyRow}>
                    <Text style={styles.staticPropertyLabel}>Efficiency:</Text>
                    <Text style={styles.staticPropertyValue}>{selectedNFTData.efficiency}</Text>
                    <Text style={styles.staticPropertyBadge}>Max</Text>
                  </View>
                  <View style={styles.staticPropertyRow}>
                    <Text style={styles.staticPropertyLabel}>Comfort:</Text>
                    <Text style={styles.staticPropertyValue}>{selectedNFTData.comfort}</Text>
                    <Text style={styles.staticPropertyBadge}>Max</Text>
                  </View>
                  <View style={styles.staticPropertyRow}>
                    <Text style={styles.staticPropertyLabel}>Luck:</Text>
                    <Text style={styles.staticPropertyValue}>{selectedNFTData.luck}</Text>
                    <Text style={styles.staticPropertyBadge}>Max</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Resilience Bar */}
            <View style={styles.resilienceSection}>
              <Text style={styles.sectionTitle}>Resilience (Repairable)</Text>
              <View style={styles.resilienceBarContainer}>
                <View style={styles.resilienceBarBackground}>
                  <View 
                    style={[
                      styles.resilienceBarFill, 
                      { width: `${currentResilience}%` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.resilienceBarRepair, 
                      { width: `${Math.round(repairAmount)}%`, left: `${currentResilience}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.resilienceText}>{currentResilience + Math.round(repairAmount)}%</Text>
              </View>
            </View>

            {currentResilience < maxResilience && !isRepaired && (
              <>
                {/* Repair Slider */}
                <View style={styles.sliderSection}>
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
                    minimumTrackTintColor="#10b981"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#10b981"
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
