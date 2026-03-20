import { Text, View, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { memo, useState, useCallback, useMemo } from 'react';
import { Skeleton, Tabs } from 'heroui-native';
import { marketplaceStyles as styles } from '@/styles';
import { useUserNFTs, useMarketplaceListings, useUpdateNFT } from '@/hooks';
import { NFTCard, SortControls } from '@/components';
import { sortNFTs, nftEvents, formatDisplayName } from '@/utils';
import type { SortOption } from '@/types';
import { colors } from '@/constants';

/**
 * Marketplace screen with "Buy" and "Sell" tabs.
 * The Buy tab shows NFTs listed by other users; the Sell tab shows
 * the current user's listed and unlistable NFTs.
 * The buy flow is currently a stub placeholder.
 */
export default memo(function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // Fetch user's NFTs for "My Listings" tab
  const { nfts, loading: userLoading, refetch: refetchUser } = useUserNFTs();
  // Fetch marketplace listings from other users
  const { listings: backendListings, loading: marketplaceLoading } = useMarketplaceListings();
  const { unlistNFT, loadingUnlistNFT: updateLoading } = useUpdateNFT();

  // Filter user's listed NFTs for "My Listings" tab
  const myListings = useMemo(() => nfts.filter(nft => nft.isListed), [nfts]);

  const sortedMarketplaceListings = useMemo(
    () => sortNFTs(backendListings, sortBy, sortOrder),
    [backendListings, sortBy, sortOrder]
  );
  const sortedMyListings = useMemo(
    () => sortNFTs(myListings, sortBy, sortOrder),
    [myListings, sortBy, sortOrder]
  );
  
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

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  }, []);

  const handleSortByChange = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <Text style={styles.description}>
        Buy and sell NFTs with other users
      </Text>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}>
        <Tabs.List>
          <Tabs.Indicator />
          <Tabs.Trigger value="buy">
            <Tabs.Label>Buy ({backendListings.length})</Tabs.Label>
          </Tabs.Trigger>
          <Tabs.Trigger value="sell">
            <Tabs.Label>My Listings ({myListings.length})</Tabs.Label>
          </Tabs.Trigger>
        </Tabs.List>

      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={handleSortByChange}
        onSortOrderToggle={handleSortOrderToggle}
      />

      <Tabs.Content value="buy">
        {marketplaceLoading ? (
          <View style={styles.grid} className="p-4">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.gridItem} className="mb-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md mt-2" />
                <Skeleton className="h-3 w-1/2 rounded-md mt-1" />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {sortedMarketplaceListings.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                <NFTCard
                  key={item.id}
                  nft={item}
                  action={
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>{item.price}</Text>
                      <TouchableOpacity
                        style={styles.buyButton}
                        onPress={handleBuyNFT}
                        accessibilityLabel={`Buy ${formatDisplayName(item.name)} for ${item.price}`}
                        accessibilityRole="button"
                        accessibilityHint="Purchase this NFT"
                      >
                        <Text style={styles.buyButtonText}>Buy</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </Tabs.Content>

      <Tabs.Content value="sell">
        {userLoading ? (
          <View style={styles.grid} className="p-4">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.gridItem} className="mb-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md mt-2" />
                <Skeleton className="h-3 w-1/2 rounded-md mt-1" />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {myListings.length > 0 && (
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  💡 These are your NFTs from the Vault currently listed for sale
                </Text>
              </View>
            )}
            <View style={styles.grid}>
              {sortedMyListings.length > 0 ? (
                sortedMyListings.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
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
                          accessibilityLabel={`Unlist ${formatDisplayName(item.name)}`}
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
          </ScrollView>
        )}
      </Tabs.Content>
      </Tabs>
    </View>
  );
});
