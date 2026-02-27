import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { vaultStyles as styles, sortStyles, filterStyles, tabStyles } from '@/styles';
import { useUserNFTs, useUpdateNFT, useMysteryBoxes } from '@/hooks';
import { NFTCard, MysteryBoxCard, SortControls, FilterControls, ScreenLoader, ScreenError, StatAllocationModal } from '@/components';
import { sortNFTs, nftEvents, formatDisplayName } from '@/utils';
import { colors } from '@/constants';
import type { NFTRarity, NFTType } from '@shared';
import type { SortOption, NFT } from '@/types';
import type { AllocateResult } from '@/hooks';

export default memo(function Vault() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { listNFT, loading: updateLoading } = useUpdateNFT();
  const { boxes, loading: boxesLoading, error: boxesError, refetch: refetchBoxes } = useMysteryBoxes();
  const [activeTab, setActiveTab] = useState<'toilets' | 'mystery-boxes'>('toilets');
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedRarities, setSelectedRarities] = useState<NFTRarity[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<NFTType[]>([]);
  const [statModalNFT, setStatModalNFT] = useState<NFT | null>(null);
  
  // Listen for NFT update events from other screens
  useEffect(() => {
    const unsubscribe = nftEvents.subscribe(() => {
      refetch();
      refetchBoxes();
    });
    return unsubscribe;
  }, [refetch, refetchBoxes]);
  
  // Filter NFTs based on selected rarities and types
  const filteredNfts = useMemo(
    () => nfts.filter(nft => {
      const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(nft.rarity);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(nft.type);
      return matchesRarity && matchesType;
    }),
    [nfts, selectedRarities, selectedTypes]
  );

  const sortedNfts = useMemo(
    () => sortNFTs(filteredNfts, sortBy, sortOrder),
    [filteredNfts, sortBy, sortOrder]
  );
  
  const handleRarityToggle = useCallback((rarity: NFTRarity) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  }, []);

  const handleTypeToggle = useCallback((type: NFTType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedRarities([]);
    setSelectedTypes([]);
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

  const handleOpenStatModal = useCallback((nft: NFT) => {
    setStatModalNFT(nft);
  }, []);

  const handleStatAllocated = useCallback((_result: AllocateResult) => {
    setStatModalNFT(null);
    refetch();
    nftEvents.emit();
  }, [refetch]);

  const handleStatModalDismiss = useCallback(() => {
    setStatModalNFT(null);
  }, []);

  const handleTabToilets = useCallback(() => setActiveTab('toilets'), []);
  const handleTabBoxes = useCallback(() => setActiveTab('mystery-boxes'), []);
  
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
        Your collection ({nfts.length} toilet{nfts.length !== 1 ? 's' : ''}, {boxes.length} box{boxes.length !== 1 ? 'es' : ''})
      </Text>

      {/* Tabs */}
      <View style={tabStyles.tabs}>
        <TouchableOpacity
          style={[tabStyles.tab, activeTab === 'toilets' && tabStyles.tabActive]}
          onPress={handleTabToilets}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'toilets' }}
        >
          <Text style={[tabStyles.tabText, activeTab === 'toilets' && tabStyles.tabTextActive]}>
            Toilets ({nfts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, activeTab === 'mystery-boxes' && tabStyles.tabActive]}
          onPress={handleTabBoxes}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'mystery-boxes' }}
        >
          <Text style={[tabStyles.tabText, activeTab === 'mystery-boxes' && tabStyles.tabTextActive]}>
            Mystery Boxes ({boxes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'toilets' ? (
        <>
          <FilterControls
            selectedRarities={selectedRarities}
            selectedTypes={selectedTypes}
            onRarityToggle={handleRarityToggle}
            onTypeToggle={handleTypeToggle}
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
                    <>
                      {(nft.stat_points ?? 0) > 0 && (
                        <TouchableOpacity
                          style={styles.allocateButton}
                          onPress={() => handleOpenStatModal(nft)}
                          accessibilityLabel={`Allocate ${nft.stat_points} stat point(s) for ${formatDisplayName(nft.name)}`}
                          accessibilityRole="button"
                        >
                          <Text style={styles.allocateButtonText}>
                            ⚡ Allocate {nft.stat_points} pt{nft.stat_points !== 1 ? 's' : ''}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {!nft.isListed ? (
                        <TouchableOpacity
                          style={[styles.listButton, updateLoading && styles.listButtonDisabled]}
                          onPress={() => handleListNFT(nft.id)}
                          disabled={updateLoading}
                          accessibilityLabel={`List ${formatDisplayName(nft.name)} for sale`}
                          accessibilityRole="button"
                          accessibilityHint="List this NFT on the marketplace"
                        >
                          <Text style={styles.listButtonText}>
                            {updateLoading ? 'Listing...' : 'List for Sale'}
                          </Text>
                        </TouchableOpacity>
                      ) : undefined}
                    </>
                  }
                />
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        /* Mystery Boxes tab */
        boxesLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.info} />
          </View>
        ) : boxesError ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            <Text style={{ color: colors.error, textAlign: 'center' }}>
              Failed to load mystery boxes: {boxesError}
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {boxes.length === 0 ? (
              <View style={{ paddingVertical: 48, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center' }}>
                  No mystery boxes yet
                </Text>
                <Text style={{ fontSize: 13, color: colors.text, opacity: 0.6, marginTop: 8, textAlign: 'center' }}>
                  Mystery boxes will appear here once you earn them.
                </Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {boxes.map((box) => (
                  <MysteryBoxCard key={box.id} box={box} />
                ))}
              </View>
            )}
          </ScrollView>
        )
      )}

      {statModalNFT && (
        <StatAllocationModal
          visible
          nft={statModalNFT}
          pointsAvailable={statModalNFT.stat_points ?? 0}
          onComplete={handleStatAllocated}
          onDismiss={handleStatModalDismiss}
        />
      )}
    </View>
  );
});
