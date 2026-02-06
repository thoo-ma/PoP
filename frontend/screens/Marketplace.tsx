import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { marketplaceStyles as styles } from '../styles';

// Placeholder marketplace data
const MARKETPLACE_ITEMS = [
  { id: '1', name: 'NFT #101', price: '0.5 ETH', seller: 'User A' },
  { id: '2', name: 'NFT #102', price: '1.2 ETH', seller: 'User B' },
  { id: '3', name: 'NFT #103', price: '0.8 ETH', seller: 'User C' },
  { id: '4', name: 'NFT #104', price: '2.0 ETH', seller: 'User D' },
  { id: '5', name: 'NFT #105', price: '0.3 ETH', seller: 'User E' },
  { id: '6', name: 'NFT #106', price: '1.5 ETH', seller: 'User F' },
];

const MY_LISTINGS = [
  { id: '1', name: 'NFT #1', price: '0.9 ETH' },
  { id: '2', name: 'NFT #2', price: '1.1 ETH' },
];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

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
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.tabActive]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={[styles.tabText, activeTab === 'sell' && styles.tabTextActive]}>
            My Listings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'buy' ? (
          <View style={styles.grid}>
            {MARKETPLACE_ITEMS.map((item) => (
              <View key={item.id} style={styles.nftCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: `https://via.placeholder.com/150/${Math.random() > 0.5 ? 'FF6B6B' : '4ECDC4'}` }}
                    style={styles.nftImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.nftName}>{item.name}</Text>
                  <Text style={styles.seller}>by {item.seller}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.price}</Text>
                    <TouchableOpacity style={styles.buyButton}>
                      <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listingsContainer}>
            {MY_LISTINGS.length > 0 ? (
              MY_LISTINGS.map((item) => (
                <View key={item.id} style={styles.listingCard}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/80/7B68EE' }}
                    style={styles.listingImage}
                    resizeMode="cover"
                  />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingName}>{item.name}</Text>
                    <Text style={styles.listingPrice}>{item.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No active listings</Text>
                <Text style={styles.emptySubtext}>List items from your vault to sell them</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
