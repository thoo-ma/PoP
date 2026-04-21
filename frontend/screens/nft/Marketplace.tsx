import { cn, Dialog, SearchField, Skeleton, Tabs, useToast } from 'heroui-native'
import { memo, useCallback, useMemo, useState } from 'react'
import { FlatList, type ListRenderItem, Text, View } from 'react-native'
import {
  AlertBox,
  EmptyState,
  NFTCard,
  ScreenError,
  SortToolbar,
  TactileButton,
} from '@/components'
import { useMarketplaceListings, useUpdateNFT, useUserNFTs } from '@/hooks'
import {
  dialogBody,
  dialogFooter,
  gridLayout,
  marketplaceItemRow,
  screenContainer,
  scrollContent,
  skeletonCard,
  tactileTabs,
} from '@/styles'
import type { NFT, SortOption } from '@/types'
import { formatDisplayName, sortNFTs } from '@/utils'

type DialogInfo = { title: string; message: string } | null

/**
 * Marketplace screen with "Buy" and "Sell" tabs.
 * The Buy tab shows NFTs listed by other users; the Sell tab shows
 * the current user's listed and unlistable NFTs.
 * The buy flow is currently a stub placeholder.
 */
export default memo(function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [sortBy, setSortBy] = useState<SortOption>('efficiency')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [dialog, setDialog] = useState<DialogInfo>(null)
  const [searchQuery, setSearchQuery] = useState('')
  // Fetch user's NFTs for "My Listings" tab
  const { nfts, loading: userLoading, error: userError, refetch: refetchNfts } = useUserNFTs()
  // Fetch marketplace listings from other users
  const {
    listings: backendListings,
    loading: marketplaceLoading,
    error: marketplaceError,
    refetch: refetchListings,
  } = useMarketplaceListings()
  const { unlistNFT, loadingUnlistNFT: updateLoading } = useUpdateNFT()
  const { toast } = useToast()

  // Filter user's listed NFTs for "My Listings" tab
  const myListings = useMemo(() => nfts.filter((nft) => nft.isListed), [nfts])

  const sortedMarketplaceListings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return sortNFTs(
      backendListings.filter(
        (nft) => normalizedQuery === '' || nft.name.toLowerCase().includes(normalizedQuery),
      ),
      sortBy,
      sortOrder,
    )
  }, [backendListings, sortBy, sortOrder, searchQuery])
  const sortedMyListings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return sortNFTs(
      myListings.filter(
        (nft) => normalizedQuery === '' || nft.name.toLowerCase().includes(normalizedQuery),
      ),
      sortBy,
      sortOrder,
    )
  }, [myListings, sortBy, sortOrder, searchQuery])

  const handleBuyNFT = useCallback(() => {
    setDialog({ title: 'Coming Soon', message: 'Buying from marketplace is not yet available.' })
  }, [])

  const handleUnlist = useCallback(
    async (nftId: string) => {
      const success = await unlistNFT(nftId)
      if (success) {
        toast.show({
          variant: 'success',
          label: 'Success',
          description: 'NFT removed from marketplace',
        })
      } else {
        toast.show({
          variant: 'danger',
          label: 'Error',
          description: 'Failed to unlist NFT',
          actionLabel: 'Retry',
          onActionPress: ({ hide }) => {
            hide()
            handleUnlist(nftId)
          },
        })
      }
    },
    [unlistNFT, toast],
  )

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }, [])

  const handleSortByChange = useCallback((option: SortOption) => {
    setSortBy(option)
  }, [])

  const skeleton = skeletonCard()
  const itemRow = useMemo(() => marketplaceItemRow(), [])
  const tabs = tactileTabs()
  const grid = useMemo(() => gridLayout(), [])

  const keyExtractor = useCallback((nft: NFT) => nft.id, [])

  const renderMarketplaceItem = useCallback<ListRenderItem<NFT>>(
    ({ item }) => (
      <View className={grid.item()}>
        <NFTCard
          nft={item}
          action={
            <View className={itemRow.root()}>
              <Text className={itemRow.price()}>{item.price}</Text>
              <TactileButton
                variant="primary"
                size="sm"
                onPress={handleBuyNFT}
                accessibilityLabel={`Buy ${formatDisplayName(item.name)} for ${item.price}`}
                accessibilityHint="Purchase this NFT"
              >
                Buy
              </TactileButton>
            </View>
          }
        />
      </View>
    ),
    [grid, itemRow, handleBuyNFT],
  )

  const renderMyListingItem = useCallback<ListRenderItem<NFT>>(
    ({ item }) => (
      <View className={grid.item()}>
        <NFTCard
          nft={item}
          action={
            <View className={itemRow.root()}>
              <Text className={itemRow.price()}>{item.price}</Text>
              <TactileButton
                variant="outline"
                size="sm"
                isDisabled={updateLoading}
                onPress={() => handleUnlist(item.id)}
                accessibilityLabel={`Unlist ${formatDisplayName(item.name)}`}
                accessibilityHint="Remove this NFT from marketplace"
              >
                {updateLoading ? 'Unlisting...' : 'Unlist'}
              </TactileButton>
            </View>
          }
        />
      </View>
    ),
    [grid, itemRow, handleUnlist, updateLoading],
  )

  if (userError) {
    return (
      <ScreenError
        title="Marketplace"
        message={`Failed to load NFTs: ${userError}`}
        onRetry={refetchNfts}
      />
    )
  }

  return (
    <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
      {/* Tabs */}
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}
      >
        <Tabs.List className={tabs.list()}>
          <Tabs.Indicator className={tabs.indicator()} />
          <Tabs.Trigger value="buy">
            {({ isSelected }) => (
              <Tabs.Label className={isSelected ? 'font-black' : 'font-bold'}>
                Buy ({backendListings.length})
              </Tabs.Label>
            )}
          </Tabs.Trigger>
          <Tabs.Trigger value="sell">
            {({ isSelected }) => (
              <Tabs.Label className={isSelected ? 'font-black' : 'font-bold'}>
                My Listings ({myListings.length})
              </Tabs.Label>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        <SearchField value={searchQuery} onChange={setSearchQuery} className="px-4 pb-2">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search NFTs..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <SortToolbar
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={handleSortByChange}
          onSortOrderToggle={handleSortOrderToggle}
        />

        <Tabs.Content value="buy">
          {marketplaceLoading ? (
            <View className={cn(gridLayout().wrapper(), 'p-4')}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} className={cn(gridLayout().item(), 'mb-3')}>
                  <Skeleton className={skeleton.image()} />
                  <Skeleton className={skeleton.titleLine()} />
                  <Skeleton className={skeleton.subtitleLine()} />
                </View>
              ))}
            </View>
          ) : marketplaceError ? (
            <View className="flex-1 justify-center items-center px-6">
              <AlertBox
                status="danger"
                title="Listings"
                description={`Failed to load: ${marketplaceError}`}
              >
                <TactileButton
                  animation="disable-all"
                  variant="primary"
                  onPress={() => refetchListings()}
                  className="mt-4"
                >
                  Retry
                </TactileButton>
              </AlertBox>
            </View>
          ) : (
            <FlatList
              data={sortedMarketplaceListings}
              keyExtractor={keyExtractor}
              renderItem={renderMarketplaceItem}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerClassName={cn(
                scrollContent({ padding: 'md', bottomPad: 'default' }),
                'w-full',
              )}
              showsVerticalScrollIndicator={false}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={5}
              removeClippedSubviews
              ListEmptyComponent={
                <EmptyState
                  title="No listings available"
                  description="Check back later or list your own NFTs."
                />
              }
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="sell">
          {userLoading ? (
            <View className={cn(gridLayout().wrapper(), 'p-4')}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} className={cn(gridLayout().item(), 'mb-3')}>
                  <Skeleton className={skeleton.image()} />
                  <Skeleton className={skeleton.titleLine()} />
                  <Skeleton className={skeleton.subtitleLine()} />
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={sortedMyListings}
              keyExtractor={keyExtractor}
              renderItem={renderMyListingItem}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerClassName={cn(
                scrollContent({ padding: 'md', bottomPad: 'default' }),
                'w-full',
              )}
              showsVerticalScrollIndicator={false}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={5}
              removeClippedSubviews
              ListEmptyComponent={
                <EmptyState
                  title="No active listings"
                  description="You haven't listed any NFTs yet."
                />
              }
            />
          )}
        </Tabs.Content>
      </Tabs>

      <Dialog
        isOpen={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className={dialogBody()}>
              <Dialog.Title>{dialog?.title}</Dialog.Title>
              <Dialog.Description>{dialog?.message}</Dialog.Description>
            </View>
            <View className={dialogFooter()}>
              <TactileButton
                animation="disable-all"
                variant="primary"
                size="sm"
                onPress={() => setDialog(null)}
              >
                OK
              </TactileButton>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
})
