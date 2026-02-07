import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { breedStyles as styles } from '../styles';
import { MOCK_NFTS } from '../constants/mockData';

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

  // Mock function to simulate asset selection - uses actual NFT from vault
  const handleSelectAsset1 = () => {
    setSelectedAsset1(MOCK_NFTS[0].id);
  };

  const handleSelectAsset2 = () => {
    setSelectedAsset2(MOCK_NFTS[1].id);
  };

  const asset1 = MOCK_NFTS.find(nft => nft.id === selectedAsset1);
  const asset2 = MOCK_NFTS.find(nft => nft.id === selectedAsset2);

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
                {selectedAsset1 && asset1 ? (
                  <View style={styles.selectedAsset}>
                    <Image
                      source={{ uri: asset1.image }}
                      style={styles.assetImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.assetLabel}>{asset1.name}</Text>
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
                {selectedAsset2 && asset2 ? (
                  <View style={styles.selectedAsset}>
                    <Image
                      source={{ uri: asset2.image }}
                      style={styles.assetImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.assetLabel}>{asset2.name}</Text>
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
                  source={{ uri: 'https://via.placeholder.com/200/9B59B6' }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                <Text style={styles.resultLabel}>NFT #NEW</Text>
              </View>

              <Text style={styles.resultDescription}>
                A unique combination of {asset1?.name} and {asset2?.name}
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
