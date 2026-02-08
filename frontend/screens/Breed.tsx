import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { breedStyles as styles } from '../styles';
import { MOCK_NFTS, type MockNFT } from '../constants/mockData';
import { NFTProperties } from '../components';

const pooImage = require('../assets/poo.jpeg');

export default function Breed() {
  const [selectedAsset1, setSelectedAsset1] = useState<string | null>(null);
  const [selectedAsset2, setSelectedAsset2] = useState<string | null>(null);
  const [breedResult, setBreedResult] = useState<MockNFT | null>(null);

  const handleBreed = () => {
    if (selectedAsset1 && selectedAsset2 && asset1 && asset2) {
      // Generate new NFT by averaging parents' properties
      const newNFT: MockNFT = {
        id: `${Date.now()}`,
        name: `NFT #${Math.floor(Math.random() * 9000) + 1000}`,
        image: pooImage,
        price: '0.0 ETH',
        isListed: false,
        efficiency: Math.round((asset1.efficiency + asset2.efficiency) / 2),
        resilience: Math.round((asset1.resilience + asset2.resilience) / 2),
        comfort: Math.round((asset1.comfort + asset2.comfort) / 2),
        luck: Math.round((asset1.luck + asset2.luck) / 2),
      };
      setBreedResult(newNFT);
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
                      source={typeof asset1.image === 'string' ? { uri: asset1.image } : asset1.image}
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
                      source={typeof asset2.image === 'string' ? { uri: asset2.image } : asset2.image}
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
              <Text style={styles.resultTitle}>🎉 New NFT Created!</Text>
              
              <View style={styles.resultCard}>
                <View style={styles.resultImageContainer}>
                  <Image
                    source={typeof breedResult.image === 'string' ? { uri: breedResult.image } : breedResult.image}
                    style={styles.resultImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.resultCardContent}>
                  <Text style={styles.resultLabel}>{breedResult.name}</Text>
                  <NFTProperties
                    efficiency={breedResult.efficiency}
                    resilience={breedResult.resilience}
                    comfort={breedResult.comfort}
                    luck={breedResult.luck}
                    mode="detailed"
                  />
                </View>
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
