import { Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { marketplaceStyles as styles, sortStyles } from '../../styles';
import { useUserNFTs, useMarketplaceListings, useUpdateNFT } from '../../hooks';
import { NFTCard, SortControls } from '../../components';
import { sortNFTs, nftEvents } from '../../utils';
import type { SortOption } from '../../types';
import { colors } from '../../constants';

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
  
  const handleBuyNFT = useCallback(() => {
    Alert.alert(
      'Coming Soon',
      'Buying from marketplace is not yet available.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleUnlist = useCallback(async (nftId: string) => {
    const success = await unlistNFT(nftId);
    if (success) {
      await refetchUser();
      nftEvents.emit();
      Alert.alert('Success', 'NFT removed from marketplace');
    } else {
      Alert.alert('Error', 'Failed to unlist NFT');
    }
  }, [unlistNFT, refetchUser]);

  const handleSetTabBuy = useCallback(() => setActiveTab('buy'), []);
  const handleSetTabSell = useCallback(() => setActiveTab('sell'), []);

  const handleSortByChange = useCallback((option: SortOption) => {
    setSortBy(option);
    setShowSortMenu(false);
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  }, []);

  const handleMenuToggle = useCallback(() => {
    setShowSortMenu(prev => !prev);
  }, []);

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
          onPress={handleSetTabBuy}
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
          onPress={handleSetTabSell}
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
        onSortByChange={handleSortByChange}
        onSortOrderToggle={handleSortOrderToggle}
        onMenuToggle={handleMenuToggle}
        styles={{ ...sortStyles, sortContainer: styles.sortContainer }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.info} />
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
                <NFTCard
                  key={item.id}
                  nft={item}
                  action={
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
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.grid}>
              {sortedMyListings.length > 0 ? (
                sortedMyListings.map((item) => (
                  <NFTCard
                    key={item.id}
                    nft={item}
                    action={
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
                    }
                  />
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
