import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { breedStyles as styles } from '../styles';

export default function Breed() {
  const [selectedAsset1, setSelectedAsset1] = useState<string | null>(null);
  const [selectedAsset2, setSelectedAsset2] = useState<string | null>(null);
  const [breedResult, setBreedResult] = useState<string | null>(null);

  const handleBreed = () => {
    if (selectedAsset1 && selectedAsset2) {
      // Simulate breeding result
      setBreedResult('bred');
    }
  };

  const handleReset = () => {
    setSelectedAsset1(null);
    setSelectedAsset2(null);
    setBreedResult(null);
  };

  // Mock function to simulate asset selection
  const handleSelectAsset1 = () => {
    setSelectedAsset1('asset1');
  };

  const handleSelectAsset2 = () => {
    setSelectedAsset2('asset2');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breed</Text>
      <Text style={styles.description}>
        Select two assets to create a new one
      </Text>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!breedResult ? (
          <>
            {/* Selection Area */}
            <View style={styles.selectionContainer}>
              {/* Asset 1 */}
              <TouchableOpacity 
                style={styles.assetSlot}
                onPress={handleSelectAsset1}
              >
                {selectedAsset1 ? (
                  <View style={styles.selectedAsset}>
                    <Image
                      source={{ uri: 'https://via.placeholder.com/150/4A90E2' }}
                      style={styles.assetImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.assetLabel}>NFT #1</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.plusIcon}>+</Text>
                    <Text style={styles.emptyText}>Select Asset 1</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Plus Icon */}
              <Text style={styles.combineIcon}>+</Text>

              {/* Asset 2 */}
              <TouchableOpacity 
                style={styles.assetSlot}
                onPress={handleSelectAsset2}
              >
                {selectedAsset2 ? (
                  <View style={styles.selectedAsset}>
                    <Image
                      source={{ uri: 'https://via.placeholder.com/150/E94E77' }}
                      style={styles.assetImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.assetLabel}>NFT #2</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.plusIcon}>+</Text>
                    <Text style={styles.emptyText}>Select Asset 2</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Breed Button */}
            <TouchableOpacity
              style={[
                styles.breedButton,
                (!selectedAsset1 || !selectedAsset2) && styles.breedButtonDisabled
              ]}
              onPress={handleBreed}
              disabled={!selectedAsset1 || !selectedAsset2}
            >
              <Text style={styles.breedButtonText}>Breed</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Result Area */}
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>New Asset Created!</Text>
              
              <View style={styles.resultAsset}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/200/7B68EE' }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                <Text style={styles.resultLabel}>NFT #NEW</Text>
              </View>

              <Text style={styles.resultDescription}>
                A unique combination of your assets
              </Text>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Breed Again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
