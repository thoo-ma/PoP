import { Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { marketplaceStyles as styles } from '../styles';
import { MOCK_MARKETPLACE_LISTINGS } from '../constants/mockData';
import { useNFTStore } from '../hooks/useNFTStore';
import NFTProperties from '../components/NFTProperties';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const { nfts, unlistNFT, subscribe } = useNFTStore();
  
  useEffect(() => {
    return subscribe();
  }, []);

  const myListings = nfts.filter(nft => nft.isListed);
  
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
        >
          <Text style={[styles.tabText, activeTab === 'buy' && styles.tabTextActive]}>
            Buy ({MOCK_MARKETPLACE_LISTINGS.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.tabActive]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={[styles.tabText, activeTab === 'sell' && styles.tabTextActive]}>
            My Listings ({myListings.length})
          </Text>
        </TouchableOpacity>
      </View>

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
            {MOCK_MARKETPLACE_LISTINGS.map((item) => (
              <View key={item.id} style={styles.nftCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.nftImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.nftName}>{item.name}</Text>
                  <Text style={styles.seller}>by User {item.id}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.price}</Text>
                    <TouchableOpacity style={styles.buyButton} onPress={handleBuyNFT}>
                      <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            {myListings.length > 0 ? (
              myListings.map((item) => (
                <View key={item.id} style={styles.nftCard}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.nftImage}
                      resizeMode="cover"
                    />
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
