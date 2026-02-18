import { Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { vaultStyles as styles, sortStyles } from '../styles';
import { useUserNFTs, useUpdateNFT } from '../hooks';
import { NFTProperties, SortControls } from '../components';
import { sortNFTs, nftEvents } from '../utils';
import type { SortOption } from '../types';

export default function Vault() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { listNFT, loading: updateLoading } = useUpdateNFT();
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Listen for NFT update events from other screens
  useEffect(() => {
    const unsubscribe = nftEvents.subscribe(() => {
      refetch();
    });
    return unsubscribe;
  }, [refetch]);
  
  const listedCount = nfts.filter(nft => nft.isListed).length;
  
  const sortedNfts = sortNFTs(nfts, sortBy, sortOrder);
  
  const handleListNFT = async (nftId: string) => {
    // Default price based on NFT properties (can be enhanced later)
    const nft = nfts.find(n => n.id === nftId);
    const basePrice = nft ? (nft.efficiency + nft.resilience + nft.comfort + nft.luck) / 400 : 0.5;
    const price = `${basePrice.toFixed(1)} ETH`;
    
    const success = await listNFT(nftId, price);
    if (success) {
      refetch(); // Refresh NFT list to show updated listing status
      nftEvents.emit(); // Notify other screens
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vault</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your collection...</Text>
        </View>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vault</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load NFTs: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vault</Text>
      <Text style={styles.description}>
        Your NFT collection ({nfts.length} NFTs, {listedCount} listed)
      </Text>
      
      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        showSortMenu={showSortMenu}
        onSortByChange={(option) => {
          setSortBy(option);
          setShowSortMenu(false);
        }}
        onSortOrderToggle={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        onMenuToggle={() => setShowSortMenu(!showSortMenu)}
        styles={sortStyles}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {sortedNfts.map((nft) => (
            <View key={nft.id} style={styles.nftCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: nft.image }}
                  style={styles.nftImage}
                  resizeMode="cover"
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv {nft.level}</Text>
                </View>
                <View style={[styles.tierBadge, styles[`${nft.tier}Badge`]]}>
                  <Text style={styles.tierText}>{nft.tier.toUpperCase()}</Text>
                </View>
                <View style={[styles.rarityBadge, styles[`${nft.rarity}Badge`]]}>
                  <Text style={styles.rarityText}>{nft.rarity.toUpperCase()}</Text>
                </View>
                {nft.isListed && (
                  <View style={styles.listedBadge}>
                    <Text style={styles.listedText}>Listed</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.nftName}>{nft.name}</Text>
                <NFTProperties
                  efficiency={nft.efficiency}
                  resilience={nft.resilience}
                  comfort={nft.comfort}
                  luck={nft.luck}
                  mode="compact"
                />
                {!nft.isListed && (
                  <TouchableOpacity 
                    style={[styles.listButton, updateLoading && styles.listButtonDisabled]}
                    onPress={() => handleListNFT(nft.id)}
                    disabled={updateLoading}
                    accessibilityLabel={`List ${nft.name} for sale`}
                    accessibilityRole="button"
                    accessibilityHint="List this NFT on the marketplace"
                  >
                    <Text style={styles.listButtonText}>
                      {updateLoading ? 'Listing...' : 'List for Sale'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

