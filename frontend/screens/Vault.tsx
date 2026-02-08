import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { vaultStyles as styles, sortStyles } from '../styles';
import { useNFTStore } from '../hooks/useNFTStore';
import { NFTProperties, SortControls } from '../components';
import { sortNFTs } from '../utils';
import type { SortOption } from '../types';

export default function Vault() {
  const { nfts, listNFT, subscribe } = useNFTStore();
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  useEffect(() => {
    return subscribe();
  }, []);
  
  const listedCount = nfts.filter(nft => nft.isListed).length;
  
  const sortedNfts = sortNFTs(nfts, sortBy, sortOrder);
  
  const handleListNFT = (nftId: string) => {
    // Default price based on NFT ID for demo
    const prices = { '3': '0.7 ETH', '4': '1.5 ETH', '5': '0.4 ETH', '6': '1.0 ETH' };
    listNFT(nftId, prices[nftId as keyof typeof prices] || '1.0 ETH');
  };
  
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
                    style={styles.listButton}
                    onPress={() => handleListNFT(nft.id)}
                  >
                    <Text style={styles.listButtonText}>List for Sale</Text>
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
