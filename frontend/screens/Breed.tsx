import { Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { breedStyles as styles } from '../styles';
import { useUserNFTs, useBreedNFT } from '../hooks';
import type { NFT } from '../types/nft';
import { NFTProperties, ScreenLoader, ScreenError } from '../components';
import { nftEvents } from '../utils';

export default function Breed() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { breedNFTs, loading: breedLoading } = useBreedNFT();
  const [selectedAsset1, setSelectedAsset1] = useState<string | null>(null);
  const [selectedAsset2, setSelectedAsset2] = useState<string | null>(null);
  const [breedResult, setBreedResult] = useState<NFT | null>(null);

  const handleBreed = async () => {
    if (!selectedAsset1 || !selectedAsset2) return;
    
    const newNFT = await breedNFTs(selectedAsset1, selectedAsset2);
    
    if (newNFT) {
      setBreedResult(newNFT);
      // Notify other screens that NFTs have been updated
      nftEvents.emit();
      Alert.alert(
        'Success!',
        'New NFT created and added to your vault!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Breeding Failed',
        'Failed to create new NFT. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReset = () => {
    setSelectedAsset1(null);
    setSelectedAsset2(null);
    setBreedResult(null);
  };

  // Select first available NFT for asset 1
  const handleSelectAsset1 = () => {
    const available = nfts.find(nft => nft.id !== selectedAsset2);
    if (available) {
      setSelectedAsset1(available.id);
    }
  };

  // Select second available NFT for asset 2
  const handleSelectAsset2 = () => {
    const available = nfts.find(nft => nft.id !== selectedAsset1);
    if (available) {
      setSelectedAsset2(available.id);
    }
  };

  const asset1 = nfts.find(nft => nft.id === selectedAsset1);
  const asset2 = nfts.find(nft => nft.id === selectedAsset2);

  if (loading) {
    return <ScreenLoader title="Breed" />;
  }

  if (error) {
    return <ScreenError title="Breed" message={`Error: ${error}`} onRetry={refetch} />;
  }

  if (nfts.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Breed</Text>
        <Text style={styles.description}>
          You need at least 2 NFTs to breed
        </Text>
      </View>
    );
  }

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
                disabled={breedLoading}
              >
                {selectedAsset1 && asset1 ? (
                  <View style={styles.selectedAsset}>
                    <Image
                      source={{ uri: asset1.image }}
                      style={styles.assetImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.assetLabel}>{asset1.name}</Text>
                    <View style={[styles.tierBadgeMini, styles[`${asset1.tier}BadgeMini`]]}>
                      <Text style={styles.tierBadgeMiniText}>{asset1.tier.toUpperCase()}</Text>
                    </View>
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
                disabled={breedLoading}
              >
                {selectedAsset2 && asset2 ? (
                  <View style={styles.selectedAsset}>
                    <Image
                      source={{ uri: asset2.image }}
                      style={styles.assetImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.assetLabel}>{asset2.name}</Text>
                    <View style={[styles.tierBadgeMini, styles[`${asset2.tier}BadgeMini`]]}>
                      <Text style={styles.tierBadgeMiniText}>{asset2.tier.toUpperCase()}</Text>
                    </View>
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
                (!selectedAsset1 || !selectedAsset2 || breedLoading) && styles.breedButtonDisabled
              ]}
              onPress={handleBreed}
              disabled={!selectedAsset1 || !selectedAsset2 || breedLoading}
            >
              <Text style={styles.breedButtonText}>
                {breedLoading ? 'Breeding...' : 'Breed'}
              </Text>
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
                    source={{ uri: breedResult.image }}
                    style={styles.resultImage}
                    resizeMode="cover"
                  />
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>Lv {breedResult.level}</Text>
                  </View>
                  <View style={[styles.tierBadge, styles[`${breedResult.tier}Badge`]]}>
                    <Text style={styles.tierBadgeText}>{breedResult.tier.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.rarityBadge, styles[`${breedResult.rarity}Badge`]]}>
                    <Text style={styles.rarityText}>{breedResult.rarity.toUpperCase()}</Text>
                  </View>
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
              accessibilityLabel="Reset and breed again"
              accessibilityRole="button"
              accessibilityHint="Clear results and select new NFTs to breed"
            >
              <Text style={styles.resetButtonText}>Breed Again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
