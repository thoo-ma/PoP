import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { repairStyles as styles } from '../styles';
import { MOCK_NFTS } from '../constants/mockData';

export default function Repair() {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [currentHealth, setCurrentHealth] = useState(60);
  const [repairAmount, setRepairAmount] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);

  const maxHealth = 100;
  const maxRepairPossible = maxHealth - currentHealth;

  const handleSelectNFT = () => {
    // Simulate NFT selection - use first NFT that's not at full health
    const nftToRepair = MOCK_NFTS.find(nft => nft.health && nft.health < 100);
    if (nftToRepair) {
      setSelectedNFT(nftToRepair.id);
      setCurrentHealth(nftToRepair.health || 60);
      setIsRepaired(false);
    }
  };

  const selectedNFTData = MOCK_NFTS.find(nft => nft.id === selectedNFT);

  const handleRepair = () => {
    setCurrentHealth(currentHealth + repairAmount);
    setIsRepaired(true);
    setRepairAmount(0);
  };

  const handleReset = () => {
    setSelectedNFT(null);
    setCurrentHealth(60);
    setRepairAmount(0);
    setIsRepaired(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repair</Text>
      <Text style={styles.description}>
        Select an NFT and restore its health
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

            {/* Health Bar */}
            <View style={styles.healthSection}>
              <Text style={styles.sectionTitle}>Current Health</Text>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthBarBackground}>
                  <View 
                    style={[
                      styles.healthBarFill, 
                      { width: `${currentHealth}%` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.healthBarRepair, 
                      { width: `${Math.round(repairAmount)}%`, left: `${currentHealth}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.healthText}>{currentHealth + Math.round(repairAmount)}%</Text>
              </View>
            </View>

            {currentHealth < maxHealth && !isRepaired && (
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
                    minimumTrackTintColor="#000"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#000"
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

            {currentHealth === maxHealth && !isRepaired && (
              <View style={styles.fullHealthMessage}>
                <Text style={styles.fullHealthText}>This NFT is at full health!</Text>
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
