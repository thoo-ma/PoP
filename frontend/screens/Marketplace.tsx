import { Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { marketplaceStyles as styles, sortStyles } from '../styles';
import { MOCK_MARKETPLACE_LISTINGS } from '../constants/mockData';
import { useNFTStore } from '../hooks/useNFTStore';
import { NFTProperties, SortControls } from '../components';
import { sortNFTs } from '../utils';
import type { SortOption } from '../types';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { nfts, unlistNFT } = useNFTStore();

  const myListings = nfts.filter(nft => nft.isListed);
  const sortedMarketplaceListings = sortNFTs(MOCK_MARKETPLACE_LISTINGS, sortBy, sortOrder);
  const sortedMyListings = sortNFTs(myListings, sortBy, sortOrder);
  
  const handleBuyNFT = () => {
    Alert.alert(
      'Coming Soon',
      'This feature is not yet available.',
      [{ text: 'OK' }]
    );
  };

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
            Buy ({MOCK_MARKETPLACE_LISTINGS.length})
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
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.nftName}>{item.name}</Text>
                  <Text style={styles.seller}>by User {item.id}</Text>
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
                      source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                      style={styles.nftImage}
                      resizeMode="cover"
                    />
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>Lv {item.level}</Text>
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
                        style={styles.unlistButton}
                        onPress={() => unlistNFT(item.id)}
                        accessibilityLabel={`Unlist ${item.name}`}
                        accessibilityRole="button"
                        accessibilityHint="Remove this NFT from marketplace"
                      >
                        <Text style={styles.unlistButtonText}>Unlist</Text>
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
    </View>
  );
}
