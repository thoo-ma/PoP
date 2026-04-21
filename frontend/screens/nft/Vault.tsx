import type { MysteryBox, NFTRarity, NFTType } from '@pop/shared'
import { useScrollToTop } from '@react-navigation/native'
import { Button, cn, SearchField, Skeleton, Tabs, useToast } from 'heroui-native'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, type ListRenderItem, ScrollView, View } from 'react-native'
import {
  AlertBox,
  EmptyState,
  FilterControls,
  MysteryBoxCard,
  MysteryBoxRevealModal,
  NFTCard,
  ScreenError,
  ScreenLoader,
  StatAllocationModal,
  TactileButton,
} from '@/components'
import { useMysteryBoxes, useOpenMysteryBox, useUpdateNFT, useUserNFTs } from '@/hooks'
import { SUPABASE_STORAGE_BASE } from '@/lib/supabase'
import {
  gridLayout,
  mysteryBoxSkeleton,
  screenContainer,
  scrollContent,
  tactileNavButton,
  tactileTabs,
} from '@/styles'
import type { AllocateResult, NFT, SortOption } from '@/types'
import { formatDisplayName, sortNFTs } from '@/utils'

/**
 * Vault screen displaying the user's full NFT and mystery-box collection.
 * Supports sorting, rarity/type filtering, marketplace listing, and
 * stat-point allocation via the `StatAllocationModal`.
 */
export default memo(function Vault() {
  const nftScrollRef = useRef<FlatList<NFT>>(null)
  const boxScrollRef = useRef<ScrollView>(null)
  useScrollToTop(nftScrollRef)
  useScrollToTop(boxScrollRef)

  const { nfts, loading, error, refetch } = useUserNFTs()
  const { listNFT } = useUpdateNFT()
  const {
    boxes,
    loading: boxesLoading,
    error: boxesError,
    refetch: refetchBoxes,
  } = useMysteryBoxes()
  const { openBox, loading: openLoading } = useOpenMysteryBox()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'toilets' | 'mystery-boxes'>('toilets')
  const [sortBy, setSortBy] = useState<SortOption>('efficiency')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedRarities, setSelectedRarities] = useState<NFTRarity[]>([])
  const [selectedTypes, setSelectedTypes] = useState<NFTType[]>([])
  const [statModalNFT, setStatModalNFT] = useState<NFT | null>(null)
  const [revealedNFT, setRevealedNFT] = useState<NFT | null>(null)
  const [revealVisible, setRevealVisible] = useState(false)
  const [openingRarity, setOpeningRarity] = useState<NFTRarity | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter NFTs based on selected rarities and types
  /** Boxes grouped by rarity, sorted transcendent → common. Always includes all 4 rarities. */
  const groupedBoxes = useMemo(() => {
    const RARITY_ORDER: NFTRarity[] = ['transcendent', 'legendary', 'rare', 'common']
    const map = new Map<NFTRarity, { box: MysteryBox; count: number }>()
    for (const box of boxes) {
      const entry = map.get(box.rarity)
      if (entry) {
        entry.count++
      } else {
        map.set(box.rarity, { box, count: 1 })
      }
    }
    return RARITY_ORDER.map((r) => {
      const entry = map.get(r)
      const imageUrl = entry?.box.image_url ?? `${SUPABASE_STORAGE_BASE}/mystery-boxes/${r}.jpg`
      return { rarity: r, box: entry?.box ?? null, count: entry?.count ?? 0, imageUrl }
    })
  }, [boxes])

  const boxRows = useMemo(() => {
    const rows: { rarity: NFTRarity; box: MysteryBox | null; count: number; imageUrl: string }[][] =
      []
    for (let i = 0; i < groupedBoxes.length; i += 2) {
      rows.push(groupedBoxes.slice(i, i + 2))
    }
    return rows
  }, [groupedBoxes])

  const filteredNfts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return nfts.filter((nft) => {
      const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(nft.rarity)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(nft.type)
      const matchesSearch =
        normalizedQuery === '' || nft.name.toLowerCase().includes(normalizedQuery)
      return matchesRarity && matchesType && matchesSearch
    })
  }, [nfts, selectedRarities, selectedTypes, searchQuery])

  const sortedNfts = useMemo(
    () => sortNFTs(filteredNfts, sortBy, sortOrder),
    [filteredNfts, sortBy, sortOrder],
  )

  const handleRarityToggle = useCallback((rarity: NFTRarity) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity],
    )
  }, [])

  const handleTypeToggle = useCallback((type: NFTType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }, [])

  const handleClearFilters = useCallback(() => {
    setSelectedRarities([])
    setSelectedTypes([])
  }, [])

  const handleSortByChange = useCallback((option: SortOption) => {
    setSortBy(option)
  }, [])

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }, [])

  const handleListNFT = useCallback(
    async (nftId: string) => {
      const nft = nfts.find((n) => n.id === nftId)
      const basePrice = nft ? (nft.efficiency + nft.resilience + nft.comfort + nft.luck) / 400 : 0.5
      const price = `${basePrice.toFixed(1)} ETH`
      await listNFT(nftId, price)
    },
    [nfts, listNFT],
  )

  const handleOpenStatModal = useCallback((nft: NFT) => {
    setStatModalNFT(nft)
  }, [])

  const handleStatAllocated = useCallback((_result: AllocateResult) => {
    setStatModalNFT(null)
  }, [])

  const handleStatModalDismiss = useCallback(() => {
    setStatModalNFT(null)
  }, [])

  const handleOpenBox = useCallback(
    async (rarity: NFTRarity) => {
      const box = boxes.find((b) => b.rarity === rarity)
      if (!box) return
      setOpeningRarity(rarity)
      const nft = await openBox(box.id)
      setOpeningRarity(null)
      if (nft) {
        setRevealedNFT(nft)
        setRevealVisible(true)
      } else {
        toast.show({
          variant: 'danger',
          label: 'Open Failed',
          description: 'Failed to open mystery box. Please try again.',
          actionLabel: 'Retry',
          onActionPress: ({ hide }) => {
            hide()
            handleOpenBox(rarity)
          },
        })
      }
    },
    [boxes, openBox, toast],
  )

  const handleRevealClose = useCallback(() => {
    setRevealVisible(false)
  }, [])

  const handleScrollToTop = useCallback(() => {
    if (activeTab === 'toilets') {
      nftScrollRef.current?.scrollToOffset({ offset: 0, animated: true })
    } else {
      boxScrollRef.current?.scrollTo({ y: 0, animated: true })
    }
  }, [activeTab])

  const grid = useMemo(() => gridLayout(), [])

  const keyExtractor = useCallback((nft: NFT) => nft.id, [])

  const renderNftItem = useCallback<ListRenderItem<NFT>>(
    ({ item: nft }) => (
      <View className={grid.item()}>
        <NFTCard
          nft={nft}
          action={
            <>
              <TactileButton
                variant="secondary"
                size="sm"
                isDisabled={(nft.stat_points ?? 0) === 0}
                onPress={() => handleOpenStatModal(nft)}
                className="mt-1"
                accessibilityLabel={`Allocate ${nft.stat_points ?? 0} stat point${(nft.stat_points ?? 0) !== 1 ? 's' : ''} for ${formatDisplayName(nft.name)}`}
              >
                {`Allocate ${nft.stat_points ?? 0} pt${(nft.stat_points ?? 0) !== 1 ? 's' : ''}`}
              </TactileButton>
              {!nft.isListed ? (
                <TactileButton
                  variant="primary"
                  size="sm"
                  isDisabled
                  onPress={() => handleListNFT(nft.id)}
                  className="mt-1"
                  accessibilityLabel={`List ${formatDisplayName(nft.name)} for sale`}
                  accessibilityHint="List this NFT on the marketplace"
                >
                  Sale
                </TactileButton>
              ) : undefined}
            </>
          }
        />
      </View>
    ),
    [grid, handleOpenStatModal, handleListNFT],
  )

  const handleNftScroll = useCallback((e: { nativeEvent: { contentOffset: { y: number } } }) => {
    setShowScrollTop(e.nativeEvent.contentOffset.y > 600)
  }, [])

  if (loading) {
    return <ScreenLoader title="Vault" message="Loading your collection..." />
  }

  if (error) {
    return <ScreenError title="Vault" message={`Failed to load NFTs: ${error}`} onRetry={refetch} />
  }

  const boxSkeleton = mysteryBoxSkeleton()
  const tabs = tactileTabs()

  return (
    <View className={screenContainer({ bg: 'surface', padTop: 'lg' })}>
      {/* Tabs */}
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as 'toilets' | 'mystery-boxes')
          setShowScrollTop(false)
        }}
      >
        <Tabs.List className={tabs.list()}>
          <Tabs.Indicator className={tabs.indicator()} />
          <Tabs.Trigger value="toilets">
            {({ isSelected }) => (
              <Tabs.Label className={isSelected ? 'font-black' : 'font-bold'}>
                Toilets ({nfts.length})
              </Tabs.Label>
            )}
          </Tabs.Trigger>
          <Tabs.Trigger value="mystery-boxes">
            {({ isSelected }) => (
              <Tabs.Label className={isSelected ? 'font-black' : 'font-bold'}>
                Mystery Boxes ({boxes.length})
              </Tabs.Label>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="toilets">
          <SearchField value={searchQuery} onChange={setSearchQuery} className="px-4 pb-2">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search NFTs..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <FilterControls
            selectedRarities={selectedRarities}
            selectedTypes={selectedTypes}
            onRarityToggle={handleRarityToggle}
            onTypeToggle={handleTypeToggle}
            onClearFilters={handleClearFilters}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={handleSortByChange}
            onSortOrderToggle={handleSortOrderToggle}
          />

          <FlatList
            ref={nftScrollRef}
            data={sortedNfts}
            keyExtractor={keyExtractor}
            renderItem={renderNftItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerClassName={cn(
              scrollContent({ padding: 'md', bottomPad: 'xl' }),
              'w-full',
            )}
            contentInset={{ bottom: 170 }}
            scrollIndicatorInsets={{ bottom: 170 }}
            showsVerticalScrollIndicator={false}
            onScroll={handleNftScroll}
            scrollEventThrottle={100}
            // Card height varies (Sale button is conditional on `!nft.isListed`),
            // so getItemLayout would be inaccurate.
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
            ListEmptyComponent={
              <EmptyState title="No NFTs found" description="Try adjusting your filters." />
            }
          />
        </Tabs.Content>
        <Tabs.Content value="mystery-boxes">
          {boxesLoading ? (
            <View className={cn(gridLayout().wrapper(), 'p-4')}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} className={cn(gridLayout().item(), 'mb-3')}>
                  <Skeleton className={boxSkeleton.image()} />
                  <View className={boxSkeleton.chipsRow()}>
                    <Skeleton className={boxSkeleton.chip()} />
                    <Skeleton className={boxSkeleton.chip()} />
                  </View>
                  <Skeleton className={boxSkeleton.button()} />
                </View>
              ))}
            </View>
          ) : boxesError ? (
            <View className="flex-1 justify-center items-center px-6">
              <AlertBox
                status="danger"
                title="Mystery Boxes"
                description={`Failed to load: ${boxesError}`}
              >
                <TactileButton
                  animation="disable-all"
                  variant="primary"
                  onPress={() => refetchBoxes()}
                  className="mt-4"
                >
                  Retry
                </TactileButton>
              </AlertBox>
            </View>
          ) : (
            <ScrollView
              ref={boxScrollRef}
              contentContainerClassName={cn(
                scrollContent({ padding: 'md', bottomPad: 'xl' }),
                'w-full',
              )}
              contentInset={{ bottom: 170 }}
              scrollIndicatorInsets={{ bottom: 170 }}
              showsVerticalScrollIndicator={false}
              onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 600)}
              scrollEventThrottle={100}
            >
              <View className="w-full">
                {boxRows.map((pair) => (
                  <View key={pair[0].rarity} className={gridLayout().row()}>
                    {pair.map((group) => {
                      const isOpening = openingRarity === group.rarity
                      const isEmpty = group.count === 0
                      return (
                        <View key={group.rarity} className={gridLayout().item()}>
                          <MysteryBoxCard
                            rarity={group.rarity}
                            box={group.box}
                            imageUrl={group.imageUrl}
                            count={group.count}
                            action={
                              <TactileButton
                                variant={isEmpty ? 'disabled' : 'primary'}
                                size="sm"
                                isDisabled={isEmpty || isOpening || openLoading}
                                onPress={() => handleOpenBox(group.rarity)}
                                className="mt-1"
                                accessibilityLabel={`Open a ${group.rarity} mystery box`}
                              >
                                {isOpening ? 'Opening...' : 'Open'}
                              </TactileButton>
                            }
                          />
                        </View>
                      )
                    })}
                    {pair.length === 1 && <View className={gridLayout().item()} />}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </Tabs.Content>
      </Tabs>

      {statModalNFT && (
        <StatAllocationModal
          isVisible
          nft={statModalNFT}
          pointsAvailable={statModalNFT.stat_points ?? 0}
          onComplete={handleStatAllocated}
          onDismiss={handleStatModalDismiss}
        />
      )}

      <MysteryBoxRevealModal
        isVisible={revealVisible}
        nft={revealedNFT}
        onDismiss={handleRevealClose}
      />

      {showScrollTop && (
        <Button
          variant="ghost"
          feedbackVariant="none"
          onPress={handleScrollToTop}
          className={cn(
            tactileNavButton(),
            'absolute bottom-44 right-4 border-outline border-b-outline',
          )}
          accessibilityLabel="Scroll to top"
        >
          <Button.Label className="text-on-surface text-[20px] font-black">↑</Button.Label>
        </Button>
      )}
    </View>
  )
})
