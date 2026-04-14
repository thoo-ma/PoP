import type { MysteryBox, NFTRarity, NFTType } from '@pop/shared'
import { useScrollToTop } from '@react-navigation/native'
import { Button, cn, Skeleton, Tabs } from 'heroui-native'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import {
  FilterControls,
  MysteryBoxCard,
  MysteryBoxRevealModal,
  NFTCard,
  ScreenError,
  ScreenLoader,
  StatAllocationModal,
} from '@/components'
import type { AllocateResult } from '@/hooks'
import { useMysteryBoxes, useOpenMysteryBox, useUpdateNFT, useUserNFTs } from '@/hooks'
import { SUPABASE_STORAGE_BASE } from '@/lib/supabase'
import {
  gridLayout,
  inlineError,
  screenContainer,
  scrollContent,
  skeletonCard,
  tactileButton,
  tactileButtonText,
  tactileNavButton,
} from '@/styles'
import type { NFT, SortOption } from '@/types'
import { formatDisplayName, sortNFTs } from '@/utils'

/**
 * Vault screen displaying the user's full NFT and mystery-box collection.
 * Supports sorting, rarity/type filtering, marketplace listing, and
 * stat-point allocation via the `StatAllocationModal`.
 */
export default memo(function Vault() {
  const nftScrollRef = useRef<ScrollView>(null)
  const boxScrollRef = useRef<ScrollView>(null)
  useScrollToTop(nftScrollRef)
  useScrollToTop(boxScrollRef)

  const { nfts, loading, error, refetch } = useUserNFTs()
  const { listNFT } = useUpdateNFT()
  const { boxes, loading: boxesLoading, error: boxesError } = useMysteryBoxes()
  const { openBox, loading: openLoading } = useOpenMysteryBox()
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

  const filteredNfts = useMemo(
    () =>
      nfts.filter((nft) => {
        const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(nft.rarity)
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(nft.type)
        return matchesRarity && matchesType
      }),
    [nfts, selectedRarities, selectedTypes],
  )

  const sortedNfts = useMemo(
    () => sortNFTs(filteredNfts, sortBy, sortOrder),
    [filteredNfts, sortBy, sortOrder],
  )

  const nftRows = useMemo(() => {
    const rows: NFT[][] = []
    for (let i = 0; i < sortedNfts.length; i += 2) {
      rows.push(sortedNfts.slice(i, i + 2))
    }
    return rows
  }, [sortedNfts])

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
      }
    },
    [boxes, openBox],
  )

  const handleRevealClose = useCallback(() => {
    setRevealVisible(false)
  }, [])

  const handleScrollToTop = useCallback(() => {
    if (activeTab === 'toilets') {
      nftScrollRef.current?.scrollTo({ y: 0, animated: true })
    } else {
      boxScrollRef.current?.scrollTo({ y: 0, animated: true })
    }
  }, [activeTab])

  if (loading) {
    return <ScreenLoader title="Vault" message="Loading your collection..." />
  }

  if (error) {
    return <ScreenError title="Vault" message={`Failed to load NFTs: ${error}`} onRetry={refetch} />
  }

  const skeleton = skeletonCard()

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
        <Tabs.List className="self-center bg-surface border-[3px] border-outline border-b-[6px] rounded-full px-1 py-1">
          <Tabs.Indicator className="bg-surface-container-low border-2 border-outline rounded-full" />
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

          <ScrollView
            ref={nftScrollRef}
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
              {nftRows.map((pair) => (
                <View key={pair[0].id} className={gridLayout().row()}>
                  {pair.map((nft) => (
                    <View key={nft.id} className={gridLayout().item()}>
                      <NFTCard
                        nft={nft}
                        action={
                          <>
                            <Button
                              variant="ghost"
                              feedbackVariant="none"
                              isDisabled={(nft.stat_points ?? 0) === 0}
                              onPress={() => handleOpenStatModal(nft)}
                              className={cn(
                                tactileButton({ variant: 'secondary', size: 'sm' }),
                                'mt-1',
                              )}
                              accessibilityLabel={`Allocate ${nft.stat_points} stat point(s) for ${formatDisplayName(nft.name)}`}
                            >
                              <Button.Label
                                className={tactileButtonText({
                                  variant: 'secondary',
                                  size: 'sm',
                                })}
                              >
                                Allocate {nft.stat_points ?? 0} pt
                                {(nft.stat_points ?? 0) !== 1 ? 's' : ''}
                              </Button.Label>
                            </Button>
                            {!nft.isListed ? (
                              <Button
                                variant="ghost"
                                feedbackVariant="none"
                                isDisabled
                                onPress={() => handleListNFT(nft.id)}
                                className={cn(
                                  tactileButton({ variant: 'primary', size: 'sm' }),
                                  'mt-1',
                                )}
                                accessibilityLabel={`List ${formatDisplayName(nft.name)} for sale`}
                                accessibilityHint="List this NFT on the marketplace"
                              >
                                <Button.Label
                                  className={tactileButtonText({
                                    variant: 'primary',
                                    size: 'sm',
                                  })}
                                >
                                  Sale
                                </Button.Label>
                              </Button>
                            ) : undefined}
                          </>
                        }
                      />
                    </View>
                  ))}
                  {pair.length === 1 && <View className={gridLayout().item()} />}
                </View>
              ))}
            </View>
          </ScrollView>
        </Tabs.Content>
        <Tabs.Content value="mystery-boxes">
          {boxesLoading ? (
            <View className={cn(gridLayout().wrapper(), 'p-4')}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} className={cn(gridLayout().item(), 'mb-3')}>
                  <Skeleton className={skeleton.image()} />
                  <Skeleton className={skeleton.titleLine()} />
                  <Skeleton className={skeleton.subtitleLine()} />
                </View>
              ))}
            </View>
          ) : boxesError ? (
            <View className={inlineError().root()}>
              <Text className={inlineError().text()}>
                Failed to load mystery boxes: {boxesError}
              </Text>
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
                              <Button
                                isDisabled={isEmpty || isOpening || openLoading}
                                onPress={() => handleOpenBox(group.rarity)}
                                className={cn(
                                  tactileButton({
                                    variant: isEmpty ? 'disabled' : 'primary',
                                    size: 'sm',
                                  }),
                                  'mt-1',
                                )}
                                accessibilityLabel={`Open a ${group.rarity} mystery box`}
                              >
                                <Button.Label
                                  className={tactileButtonText({
                                    variant: isEmpty ? 'disabled' : 'primary',
                                    size: 'sm',
                                  })}
                                >
                                  {isOpening ? 'Opening...' : 'Open'}
                                </Button.Label>
                              </Button>
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
