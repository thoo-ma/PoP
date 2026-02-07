import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { repairStyles as styles } from '../styles';

export default function Repair() {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [currentHealth, setCurrentHealth] = useState(60); // Current health percentage
  const [repairAmount, setRepairAmount] = useState(0); // How much to repair (0-40 in this case)
  const [isRepaired, setIsRepaired] = useState(false);

  const maxHealth = 100;
  const maxRepairPossible = maxHealth - currentHealth;

  const handleSelectNFT = () => {
    // Simulate NFT selection
    setSelectedNFT('nft1');
    setIsRepaired(false);
  };

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
                source={{ uri: 'https://via.placeholder.com/200/9B59B6' }}
                style={styles.nftImage}
                resizeMode="cover"
              />
              <Text style={styles.nftName}>NFT #{selectedNFT}</Text>
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
                </View>
                <Text style={styles.healthText}>{currentHealth}%</Text>
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
                  <Text style={styles.sliderHint}>
                    New health: {currentHealth + Math.round(repairAmount)}%
                  </Text>
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
