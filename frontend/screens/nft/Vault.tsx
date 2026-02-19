import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { vaultStyles as styles, sortStyles, filterStyles } from '../../styles';
import { useUserNFTs, useUpdateNFT } from '../../hooks';
import { NFTCard, SortControls, FilterControls, ScreenLoader, ScreenError } from '../../components';
import { sortNFTs, nftEvents } from '../../utils';
import type { SortOption, NFTRarity, NFTTier } from '../../types';

export default function Vault() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { listNFT, loading: updateLoading } = useUpdateNFT();
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedRarities, setSelectedRarities] = useState<NFTRarity[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<NFTTier[]>([]);
  
  // Listen for NFT update events from other screens
  useEffect(() => {
    const unsubscribe = nftEvents.subscribe(() => {
      refetch();
    });
    return unsubscribe;
  }, [refetch]);
  
  // Filter NFTs based on selected rarities and tiers
  const filteredNfts = nfts.filter(nft => {
    const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(nft.rarity);
    const matchesTier = selectedTiers.length === 0 || selectedTiers.includes(nft.tier);
    return matchesRarity && matchesTier;
  });
  
  const listedCount = nfts.filter(nft => nft.isListed).length;
  
  const sortedNfts = sortNFTs(filteredNfts, sortBy, sortOrder);
  
  const handleRarityToggle = useCallback((rarity: NFTRarity) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  }, []);

  const handleTierToggle = useCallback((tier: NFTTier) => {
    setSelectedTiers(prev =>
      prev.includes(tier)
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedRarities([]);
    setSelectedTiers([]);
  }, []);

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

  const handleListNFT = useCallback(async (nftId: string) => {
    const nft = nfts.find(n => n.id === nftId);
    const basePrice = nft ? (nft.efficiency + nft.resilience + nft.comfort + nft.luck) / 400 : 0.5;
    const price = `${basePrice.toFixed(1)} ETH`;
    const success = await listNFT(nftId, price);
    if (success) {
      refetch();
      nftEvents.emit();
    }
  }, [nfts, listNFT, refetch]);
  
  if (loading) {
    return <ScreenLoader title="Vault" message="Loading your collection..." />;
  }

  if (error) {
    return <ScreenError title="Vault" message={`Failed to load NFTs: ${error}`} onRetry={refetch} />;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vault</Text>
      <Text style={styles.description}>
        Your NFT collection ({sortedNfts.length} of {nfts.length} NFTs, {listedCount} listed)
      </Text>
      
      <FilterControls
        selectedRarities={selectedRarities}
        selectedTiers={selectedTiers}
        onRarityToggle={handleRarityToggle}
        onTierToggle={handleTierToggle}
        onClearFilters={handleClearFilters}
        styles={filterStyles}
      />
      
      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        showSortMenu={showSortMenu}
        onSortByChange={handleSortByChange}
        onSortOrderToggle={handleSortOrderToggle}
        onMenuToggle={handleMenuToggle}
        styles={sortStyles}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {sortedNfts.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              action={
                !nft.isListed ? (
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
                ) : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

