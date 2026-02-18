import { Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { marketplaceStyles as styles, sortStyles } from '../styles';
import { useUserNFTs, useMarketplaceListings, useUpdateNFT } from '../hooks';
import { NFTProperties, SortControls } from '../components';
import { sortNFTs } from '../utils';
import type { SortOption } from '../types';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Fetch user's NFTs for "My Listings" tab
  const { nfts, loading: userLoading, refetch: refetchUser } = useUserNFTs();
  // Fetch marketplace listings from other users
  const { listings: backendListings, loading: marketplaceLoading } = useMarketplaceListings();
  const { unlistNFT, loading: updateLoading } = useUpdateNFT();

  // Filter user's listed NFTs for "My Listings" tab
  const marketplaceListings = backendListings;
  const myListings = nfts.filter(nft => nft.isListed);
  
  const sortedMarketplaceListings = sortNFTs(marketplaceListings, sortBy, sortOrder);
  const sortedMyListings = sortNFTs(myListings, sortBy, sortOrder);
  
  const handleBuyNFT = () => {
    Alert.alert(
      'Coming Soon',
      'Buying from marketplace is not yet available.',
      [{ text: 'OK' }]
    );
  };

  const handleUnlist = async (nftId: string) => {
    const success = await unlistNFT(nftId);
    if (success) {
      await refetchUser(); // Refresh user's NFT list
      Alert.alert('Success', 'NFT removed from marketplace');
    } else {
      Alert.alert('Error', 'Failed to unlist NFT');
    }
  };

  const loading = activeTab === 'buy' ? marketplaceLoading : userLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <Text style={styles.description}>
        Buy and sell NFTs with other users
      </Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buy' && styles.tabActive]}
          onPress={() => setActiveTab('buy')}
          accessibilityLabel="Browse marketplace"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'buy' }}
        >
          <Text style={[styles.tabText, activeTab === 'buy' && styles.tabTextActive]}>
            Buy ({marketplaceListings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.tabActive]}
          onPress={() => setActiveTab('sell')}
          accessibilityLabel="My listings"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'sell' }}
        >
          <Text style={[styles.tabText, activeTab === 'sell' && styles.tabTextActive]}>
            My Listings ({myListings.length})
          </Text>
        </TouchableOpacity>
      </View>

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
        styles={{ ...sortStyles, sortContainer: styles.sortContainer }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'sell' && myListings.length > 0 && (
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                💡 These are your NFTs from the Vault currently listed for sale
              </Text>
            </View>
          )}
          
          {activeTab === 'buy' ? (
            <View style={styles.grid}>
              {sortedMarketplaceListings.map((item) => (
                <View key={item.id} style={styles.nftCard}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                      style={styles.nftImage}
                      resizeMode="cover"
                    />
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>Lv {item.level}</Text>
                    </View>
                    {item.tier && (
                      <View style={[styles.tierBadge, styles[`${item.tier}Badge`]]}>
                        <Text style={styles.tierText}>{item.tier.toUpperCase()}</Text>
                      </View>
                    )}
                    {item.rarity && (
                      <View style={[styles.rarityBadge, styles[`${item.rarity}Badge`]]}>
                        <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.nftName}>{item.name}</Text>
                    <Text style={styles.seller}>by User {item.id.substring(0, 8)}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>{item.price}</Text>
                      <TouchableOpacity 
                        style={styles.buyButton} 
                        onPress={handleBuyNFT}
                        accessibilityLabel={`Buy ${item.name} for ${item.price}`}
                        accessibilityRole="button"
                        accessibilityHint="Purchase this NFT"
                      >
                        <Text style={styles.buyButtonText}>Buy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.grid}>
              {sortedMyListings.length > 0 ? (
                sortedMyListings.map((item) => (
                  <View key={item.id} style={styles.nftCard}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.nftImage}
                        resizeMode="cover"
                      />
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Lv {item.level}</Text>
                      </View>
                      <View style={[styles.tierBadge, styles[`${item.tier}Badge`]]}>
                        <Text style={styles.tierText}>{item.tier.toUpperCase()}</Text>
                      </View>
                      <View style={[styles.rarityBadge, styles[`${item.rarity}Badge`]]}>
                        <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
                      </View>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.nftName}>{item.name}</Text>
                      <NFTProperties
                        efficiency={item.efficiency}
                        resilience={item.resilience}
                        comfort={item.comfort}
                        luck={item.luck}
                        mode="compact"
                      />
                      <View style={styles.priceRow}>
                        <Text style={styles.price}>{item.price}</Text>
                        <TouchableOpacity 
                          style={[styles.unlistButton, updateLoading && styles.unlistButtonDisabled]}
                          onPress={() => handleUnlist(item.id)}
                          disabled={updateLoading}
                          accessibilityLabel={`Unlist ${item.name}`}
                          accessibilityRole="button"
                          accessibilityHint="Remove this NFT from marketplace"
                        >
                          <Text style={styles.unlistButtonText}>
                            {updateLoading ? 'Unlisting...' : 'Unlist'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No active listings</Text>
                  <Text style={styles.emptySubtext}>
                    You haven't listed any NFTs yet.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
