import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import type { NFTRarity } from '@pop/shared'
import { BottomSheet } from 'heroui-native'
import { useCallback, useMemo } from 'react'
import { Text, useWindowDimensions } from 'react-native'
import { pickerModal } from '@/styles'
import type { NFT } from '@/types'
import { canBreed } from '@/utils'
import BreedPickerItemCard from './BreedPickerItemCard'

const GRID_PADDING = 16
const GRID_GAP = 12

export interface BreedPickerModalProps {
  /** Controls modal visibility. */
  isVisible: boolean
  /** Full NFT collection to show as selectable items. */
  allNFTs: NFT[]
  /** ID of the NFT already chosen in the other slot — rendered as disabled. */
  lockedId?: string
  /** Rarity of the other slot's NFT — items incompatible with it are disabled. */
  lockedRarity?: NFTRarity
  /** Called with the chosen NFT when the user taps a valid row. */
  onSelect: (nft: NFT) => void
  /** Called when the user dismisses the sheet without selecting. */
  onDismiss: () => void
}

/**
 * Bottom-sheet modal for picking an NFT to place in a breed parent slot.
 * Items that conflict with `lockedId` or are incompatible with `lockedRarity`
 * are shown greyed-out and non-interactive.
 */
export default function BreedPickerModal({
  isVisible,
  allNFTs,
  lockedId,
  lockedRarity,
  onSelect,
  onDismiss,
}: BreedPickerModalProps) {
  const s = pickerModal()
  const { width: windowWidth } = useWindowDimensions()
  const cardWidth = (windowWidth - GRID_PADDING * 2 - GRID_GAP) / 2

  const items = useMemo(
    () =>
      allNFTs.map((nft) => ({
        nft,
        disabled:
          nft.id === lockedId ||
          (lockedRarity !== undefined && !canBreed(lockedRarity, nft.rarity)),
      })),
    [allNFTs, lockedId, lockedRarity],
  )

  const keyExtractor = useCallback((item: { nft: NFT; disabled: boolean }) => item.nft.id, [])

  const renderItem = useCallback(
    ({ item }: { item: { nft: NFT; disabled: boolean } }) => (
      <BreedPickerItemCard
        nft={item.nft}
        disabled={item.disabled}
        isSelected={lockedId !== undefined && lockedId === item.nft.id}
        width={cardWidth}
        onPress={() => {
          onSelect(item.nft)
          onDismiss()
        }}
      />
    ),
    [lockedId, cardWidth, onSelect, onDismiss],
  )

  return (
    <BottomSheet
      isOpen={isVisible}
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={['70%']}>
          {lockedRarity && (
            <Text className={s.helpText()}>
              Greyed-out NFTs are incompatible with your first selection.
            </Text>
          )}
          <BottomSheetFlatList<{ nft: NFT; disabled: boolean }>
            data={items}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={{ gap: GRID_GAP }}
            contentContainerStyle={{ padding: GRID_PADDING, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  )
}
