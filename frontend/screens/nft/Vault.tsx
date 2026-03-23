import { Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Skeleton, Tabs, ScrollShadow } from 'heroui-native';
import { useUserNFTs, useUpdateNFT, useMysteryBoxes, useOpenMysteryBox } from '@/hooks';
import { NFTCard, MysteryBoxCard, SortControls, FilterControls, ScreenLoader, ScreenError, StatAllocationModal, MysteryBoxRevealModal } from '@/components';
import { sortNFTs, nftEvents, formatDisplayName } from '@/utils';
import type { NFTRarity, NFTType, MysteryBox } from '@shared';
import type { SortOption, NFT } from '@/types';
import type { AllocateResult } from '@/hooks';

/**
 * Vault screen displaying the user's full NFT and mystery-box collection.
 * Supports sorting, rarity/type filtering, marketplace listing, and
 * stat-point allocation via the `StatAllocationModal`.
 */
export default memo(function Vault() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { listNFT, loadingListNFT: updateLoading } = useUpdateNFT();
  const { boxes, loading: boxesLoading, error: boxesError, refetch: refetchBoxes } = useMysteryBoxes();
  const { openBox, loading: openLoading } = useOpenMysteryBox();
  const [activeTab, setActiveTab] = useState<'toilets' | 'mystery-boxes'>('toilets');
  const [sortBy, setSortBy] = useState<SortOption>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRarities, setSelectedRarities] = useState<NFTRarity[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<NFTType[]>([]);
  const [statModalNFT, setStatModalNFT] = useState<NFT | null>(null);
  const [revealedNFT, setRevealedNFT] = useState<NFT | null>(null);
  const [revealVisible, setRevealVisible] = useState(false);
  const [openingRarity, setOpeningRarity] = useState<NFTRarity | null>(null);
  
  // Listen for NFT update events from other screens
  useEffect(() => {
    const unsubscribe = nftEvents.subscribe(() => {
      refetch();
      refetchBoxes();
    });
    return unsubscribe;
  }, [refetch, refetchBoxes]);
  
  // Filter NFTs based on selected rarities and types
  /** Boxes grouped by rarity, sorted transcendent → common. */
  const groupedBoxes = useMemo(() => {
    const RARITY_ORDER: NFTRarity[] = ['transcendent', 'legendary', 'rare', 'common'];
    const map = new Map<NFTRarity, { box: MysteryBox; count: number }>();
    for (const box of boxes) {
      const entry = map.get(box.rarity);
      if (entry) {
        entry.count++;
      } else {
        map.set(box.rarity, { box, count: 1 });
      }
    }
    return RARITY_ORDER.flatMap((r) => {
      const entry = map.get(r);
      return entry ? [{ rarity: r, box: entry.box, count: entry.count }] : [];
    });
  }, [boxes]);

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
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
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

  const handleOpenBox = useCallback(async (rarity: NFTRarity) => {
    const box = boxes.find((b) => b.rarity === rarity);
    if (!box) return;
    setOpeningRarity(rarity);
    const nft = await openBox(box.id);
    setOpeningRarity(null);
    if (nft) {
      setRevealedNFT(nft);
      setRevealVisible(true);
      refetchBoxes();
      refetch();
      nftEvents.emit();
    }
  }, [boxes, openBox, refetchBoxes, refetch]);

  const handleRevealClose = useCallback(() => {
    setRevealVisible(false);
  }, []);
  
  if (loading) {
    return <ScreenLoader title="Vault" message="Loading your collection..." />;
  }

  if (error) {
    return <ScreenError title="Vault" message={`Failed to load NFTs: ${error}`} onRetry={refetch} />;
  }
  
  return (
    <View className="flex-1 bg-surface-bg items-center pt-20">
      <Text className="text-[32px] font-bold mb-3 text-center text-text-title">Vault</Text>
      <Text className="text-base mb-4 text-center text-text-body">
        Your collection ({nfts.length} toilet{nfts.length !== 1 ? 's' : ''}, {boxes.length} box{boxes.length !== 1 ? 'es' : ''})
      </Text>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'toilets' | 'mystery-boxes')}>
        <Tabs.List className="self-center">
          <Tabs.Indicator />
          <Tabs.Trigger value="toilets">
            <Tabs.Label>Toilets ({nfts.length})</Tabs.Label>
          </Tabs.Trigger>
          <Tabs.Trigger value="mystery-boxes">
            <Tabs.Label>Mystery Boxes ({boxes.length})</Tabs.Label>
          </Tabs.Trigger>
        </Tabs.List>

      <Tabs.Content value="toilets">
        <>
          <FilterControls
            selectedRarities={selectedRarities}
            selectedTypes={selectedTypes}
            onRarityToggle={handleRarityToggle}
            onTypeToggle={handleTypeToggle}
            onClearFilters={handleClearFilters}
          />

          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={handleSortByChange}
            onSortOrderToggle={handleSortOrderToggle}
          />

          <ScrollShadow LinearGradientComponent={LinearGradient}>
            <ScrollView
              contentContainerClassName="px-5 pb-[120px] w-full"
              showsVerticalScrollIndicator={false}
            >
            <View className="flex-row flex-wrap justify-between w-full">
              {sortedNfts.map((nft) => (
                <View key={nft.id} className="w-[48%]">
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  action={
                    <>
                      {(nft.stat_points ?? 0) > 0 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-1"
                          onPress={() => handleOpenStatModal(nft)}
                          accessibilityLabel={`Allocate ${nft.stat_points} stat point(s) for ${formatDisplayName(nft.name)}`}
                        >
                          <Button.Label>⚡ Allocate {nft.stat_points} pt{nft.stat_points !== 1 ? 's' : ''}</Button.Label>
                        </Button>
                      )}
                      {!nft.isListed ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-1"
                          isDisabled={updateLoading}
                          onPress={() => handleListNFT(nft.id)}
                          accessibilityLabel={`List ${formatDisplayName(nft.name)} for sale`}
                          accessibilityHint="List this NFT on the marketplace"
                        >
                          <Button.Label>{updateLoading ? 'Listing...' : 'List for Sale'}</Button.Label>
                        </Button>
                      ) : undefined}
                    </>
                  }
                />
                </View>
              ))}
            </View>
          </ScrollView>
          </ScrollShadow>
        </>
      </Tabs.Content>
      <Tabs.Content value="mystery-boxes">
      {boxesLoading ? (
          <View className="flex-row flex-wrap justify-between w-full p-4">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className="w-[48%] mb-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md mt-2" />
                <Skeleton className="h-3 w-1/2 rounded-md mt-1" />
              </View>
            ))}
          </View>
        ) : boxesError ? (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-app-error text-center">
              Failed to load mystery boxes: {boxesError}
            </Text>
          </View>
        ) : (
          <ScrollShadow LinearGradientComponent={LinearGradient}>
            <ScrollView
              contentContainerClassName="px-5 pb-[120px] w-full"
              showsVerticalScrollIndicator={false}
            >
            {boxes.length === 0 ? (
              <View className="py-12 items-center">
                <Text className="text-base text-text-body text-center">
                  No mystery boxes yet
                </Text>
                <Text className="text-sm text-text-body opacity-60 mt-2 text-center">
                  Mystery boxes will appear here once you earn them.
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between w-full">
                {groupedBoxes.map((group) => {
                  const isOpening = openingRarity === group.rarity;
                  return (
                    <View key={group.rarity} className="w-[48%]">
                    <MysteryBoxCard
                      box={group.box}
                      count={group.count}
                      action={
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-1"
                          isDisabled={isOpening || openLoading}
                          onPress={() => handleOpenBox(group.rarity)}
                          accessibilityLabel={`Open a ${group.rarity} mystery box`}
                        >
                          <Button.Label>{isOpening ? 'Opening...' : 'Open'}</Button.Label>
                        </Button>
                      }
                    />
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
          </ScrollShadow>
        )
      }
      </Tabs.Content>
      </Tabs>

      {statModalNFT && (
        <StatAllocationModal
          visible
          nft={statModalNFT}
          pointsAvailable={statModalNFT.stat_points ?? 0}
          onComplete={handleStatAllocated}
          onDismiss={handleStatModalDismiss}
        />
      )}

      <MysteryBoxRevealModal
        visible={revealVisible}
        nft={revealedNFT}
        onClose={handleRevealClose}
      />
    </View>
  );
});
