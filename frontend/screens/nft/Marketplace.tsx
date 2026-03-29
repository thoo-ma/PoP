import { Text, View, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { memo, useState, useCallback, useMemo } from 'react'
import { Button, Dialog, Skeleton, Tabs, ScrollShadow, cn } from 'heroui-native'
import {
  screenContainer,
  scrollContent,
  gridLayout,
  emptyState,
  dialogBody,
  skeletonCard,
} from '@/styles'
import { useUserNFTs, useMarketplaceListings, useUpdateNFT } from '@/hooks'
import { NFTCard, SortControls } from '@/components'
import { sortNFTs, nftEvents, formatDisplayName } from '@/utils'
import type { SortOption } from '@/types'

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
  // Fetch user's NFTs for "My Listings" tab
  const { nfts, loading: userLoading, refetch: refetchUser } = useUserNFTs()
  // Fetch marketplace listings from other users
  const { listings: backendListings, loading: marketplaceLoading } = useMarketplaceListings()
  const { unlistNFT, loadingUnlistNFT: updateLoading } = useUpdateNFT()

  // Filter user's listed NFTs for "My Listings" tab
  const myListings = useMemo(() => nfts.filter((nft) => nft.isListed), [nfts])

  const sortedMarketplaceListings = useMemo(
    () => sortNFTs(backendListings, sortBy, sortOrder),
    [backendListings, sortBy, sortOrder],
  )
  const sortedMyListings = useMemo(
    () => sortNFTs(myListings, sortBy, sortOrder),
    [myListings, sortBy, sortOrder],
  )

  const handleBuyNFT = useCallback(() => {
    setDialog({ title: 'Coming Soon', message: 'Buying from marketplace is not yet available.' })
  }, [])

  const handleUnlist = useCallback(
    async (nftId: string) => {
      const success = await unlistNFT(nftId)
      if (success) {
        await refetchUser()
        nftEvents.emit()
        setDialog({ title: 'Success', message: 'NFT removed from marketplace' })
      } else {
        setDialog({ title: 'Error', message: 'Failed to unlist NFT' })
      }
    },
    [unlistNFT, refetchUser],
  )

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }, [])

  const handleSortByChange = useCallback((option: SortOption) => {
    setSortBy(option)
  }, [])

  const emptyStyles = emptyState()
  const skeleton = skeletonCard()

  return (
    <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
      {/* Tabs */}
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}
      >
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
            <ScrollShadow LinearGradientComponent={LinearGradient}>
              <ScrollView
                contentContainerClassName={cn(
                  scrollContent({ padding: 'md', bottomPad: 'md' }),
                  'w-full',
                )}
                showsVerticalScrollIndicator={false}
              >
                <View className={gridLayout().wrapper()}>
                  {sortedMarketplaceListings.map((item) => (
                    <View key={item.id} className={gridLayout().item()}>
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
            <ScrollShadow LinearGradientComponent={LinearGradient}>
              <ScrollView
                contentContainerClassName={cn(
                  scrollContent({ padding: 'md', bottomPad: 'md' }),
                  'w-full',
                )}
                showsVerticalScrollIndicator={false}
              >
                <View className={gridLayout().wrapper()}>
                  {sortedMyListings.length > 0 ? (
                    sortedMyListings.map((item) => (
                      <View key={item.id} className={gridLayout().item()}>
                        <NFTCard
                          key={item.id}
                          nft={item}
                          action={
                            <View className="flex-row justify-between items-center">
                              <Text className="text-sm font-bold text-text-title">
                                {item.price}
                              </Text>
                              <Button
                                variant="outline"
                                size="sm"
                                isDisabled={updateLoading}
                                onPress={() => handleUnlist(item.id)}
                                accessibilityLabel={`Unlist ${formatDisplayName(item.name)}`}
                                accessibilityHint="Remove this NFT from marketplace"
                              >
                                <Button.Label>
                                  {updateLoading ? 'Unlisting...' : 'Unlist'}
                                </Button.Label>
                              </Button>
                            </View>
                          }
                        />
                      </View>
                    ))
                  ) : (
                    <View className={cn(emptyStyles.root(), 'py-[60px] w-full')}>
                      <Text className={emptyStyles.title()}>No active listings</Text>
                      <Text className={cn(emptyStyles.detail(), 'mt-1 leading-5')}>
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
            <View className="flex-row justify-end">
              <Button variant="primary" size="sm" onPress={() => setDialog(null)}>
                <Button.Label>OK</Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
})
