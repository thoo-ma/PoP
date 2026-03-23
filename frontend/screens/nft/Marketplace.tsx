import { Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useState, useCallback, useMemo } from 'react';
import { Button, Dialog, Skeleton, Tabs, ScrollShadow } from 'heroui-native';
import { useUserNFTs, useMarketplaceListings, useUpdateNFT } from '@/hooks';
import { NFTCard, SortControls } from '@/components';
import { sortNFTs, nftEvents, formatDisplayName } from '@/utils';
import type { SortOption } from '@/types';

type DialogInfo = { title: string; message: string } | null;

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
  const [dialog, setDialog] = useState<DialogInfo>(null);
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
    setDialog({ title: 'Coming Soon', message: 'Buying from marketplace is not yet available.' });
  }, []);

  const handleUnlist = useCallback(async (nftId: string) => {
    const success = await unlistNFT(nftId);
    if (success) {
      await refetchUser();
      nftEvents.emit();
      setDialog({ title: 'Success', message: 'NFT removed from marketplace' });
    } else {
      setDialog({ title: 'Error', message: 'Failed to unlist NFT' });
    }
  }, [unlistNFT, refetchUser]);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  }, []);

  const handleSortByChange = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  return (
    <View className="flex-1 bg-surface-bg items-center pt-20">
      <Text className="text-[32px] font-bold mb-3 text-center text-text-title">Marketplace</Text>
      <Text className="text-base mb-4 text-center text-text-body">
        Buy and sell NFTs with other users
      </Text>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}>
        <Tabs.List className="self-center">
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
          <View className="flex-row flex-wrap justify-between w-full p-4">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className="w-[48%] mb-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md mt-2" />
                <Skeleton className="h-3 w-1/2 rounded-md mt-1" />
              </View>
            ))}
          </View>
        ) : (
          <ScrollShadow LinearGradientComponent={LinearGradient}>
            <ScrollView
              contentContainerClassName="px-5 pb-[120px] w-full"
              showsVerticalScrollIndicator={false}
            >
            <View className="flex-row flex-wrap justify-between w-full">
              {sortedMarketplaceListings.map((item) => (
                <View key={item.id} className="w-[48%]">
                <NFTCard
                  key={item.id}
                  nft={item}
                  action={
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm font-bold text-text-title">{item.price}</Text>
                      <Button
                        variant="primary"
                        size="sm"
                        onPress={handleBuyNFT}
                        accessibilityLabel={`Buy ${formatDisplayName(item.name)} for ${item.price}`}
                        accessibilityHint="Purchase this NFT"
                      >
                        <Button.Label>Buy</Button.Label>
                      </Button>
                    </View>
                  }
                />
                </View>
              ))}
            </View>
            </ScrollView>
          </ScrollShadow>
        )}
      </Tabs.Content>

      <Tabs.Content value="sell">
        {userLoading ? (
          <View className="flex-row flex-wrap justify-between w-full p-4">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className="w-[48%] mb-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md mt-2" />
                <Skeleton className="h-3 w-1/2 rounded-md mt-1" />
              </View>
            ))}
          </View>
        ) : (
          <ScrollShadow LinearGradientComponent={LinearGradient}>
            <ScrollView
              contentContainerClassName="px-5 pb-[120px] w-full"
              showsVerticalScrollIndicator={false}
            >
            {myListings.length > 0 && (
              <View className="bg-[#fef3c7] rounded-xl p-4 mb-5 border border-[#fbbf24]">
                <Text className="text-sm text-[#78350f] text-center leading-5">
                  💡 These are your NFTs from the Vault currently listed for sale
                </Text>
              </View>
            )}
            <View className="flex-row flex-wrap justify-between w-full">
              {sortedMyListings.length > 0 ? (
                sortedMyListings.map((item) => (
                  <View key={item.id} className="w-[48%]">
                  <NFTCard
                    key={item.id}
                    nft={item}
                    action={
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-bold text-text-title">{item.price}</Text>
                        <Button
                          variant="outline"
                          size="sm"
                          isDisabled={updateLoading}
                          onPress={() => handleUnlist(item.id)}
                          accessibilityLabel={`Unlist ${formatDisplayName(item.name)}`}
                          accessibilityHint="Remove this NFT from marketplace"
                        >
                          <Button.Label>{updateLoading ? 'Unlisting...' : 'Unlist'}</Button.Label>
                        </Button>
                      </View>
                    }
                  />
                  </View>
                ))
              ) : (
                <View className="items-center py-[60px] w-full">
                  <Text className="text-base font-semibold text-text-title mb-2">No active listings</Text>
                  <Text className="text-sm text-text-body text-center mt-1 leading-5">
                    You haven't listed any NFTs yet.
                  </Text>
                </View>
              )}
            </View>
            </ScrollView>
          </ScrollShadow>
        )}
      </Tabs.Content>
      </Tabs>

      <Dialog isOpen={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className="mb-4 gap-1.5">
              <Dialog.Title>{dialog?.title}</Dialog.Title>
              <Dialog.Description>{dialog?.message}</Dialog.Description>
            </View>
            <View className="flex-row justify-end">
              <Button variant="primary" size="sm" onPress={() => setDialog(null)}>
                <Button.Label>OK</Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
});
