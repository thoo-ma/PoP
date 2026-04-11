import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import type { NFTRarity } from '@pop/shared'
import { BottomSheet, Card, PressableFeedback } from 'heroui-native'
import { Image, Text, useWindowDimensions, View } from 'react-native'
import { RARITY_COLORS } from '@/constants'
import { breedPickerCard, pickerModal } from '@/styles'
import type { NFT } from '@/types'
import { canBreed, formatDisplayName } from '@/utils'

const GRID_PADDING = 16
const GRID_GAP = 12

export interface BreedPickerModalProps {
  /** Controls modal visibility. */
  visible: boolean
  /** Title displayed at the top of the sheet (e.g. "Choose Parent 1"). */
  title: string
  /** Full NFT collection to show as selectable items. */
  allNFTs: NFT[]
  /** ID of the NFT already chosen in the other slot — rendered as disabled. */
  lockedId?: string
  /** Rarity of the other slot's NFT — items incompatible with it are disabled. */
  lockedRarity?: NFTRarity
  /** Called with the chosen NFT when the user taps a valid row. */
  onSelect: (nft: NFT) => void
  /** Called when the user dismisses the sheet without selecting. */
  onClose: () => void
}

/**
 * Bottom-sheet modal for picking an NFT to place in a breed parent slot.
 * Items that conflict with `lockedId` or are incompatible with `lockedRarity`
 * are shown greyed-out and non-interactive.
 */
export default function BreedPickerModal({
  visible,
  title,
  allNFTs,
  lockedId,
  lockedRarity,
  onSelect,
  onClose,
}: BreedPickerModalProps) {
  const { width: windowWidth } = useWindowDimensions()
  const cardWidth = (windowWidth - GRID_PADDING * 2 - GRID_GAP) / 2

  const items = allNFTs.map((nft) => ({
    nft,
    disabled:
      nft.id === lockedId || (lockedRarity !== undefined && !canBreed(lockedRarity, nft.rarity)),
  }))

  const s = pickerModal()

  return (
    <BottomSheet
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={['70%']}>
          <View className={s.header()}>
            <BottomSheet.Title className="text-lg font-bold text-foreground">
              {title}
            </BottomSheet.Title>
            <BottomSheet.Close />
          </View>
          {lockedRarity && (
            <Text className={s.helpText()}>
              Greyed-out NFTs are incompatible with your first selection.
            </Text>
          )}
          <BottomSheetFlatList<{ nft: NFT; disabled: boolean }>
            data={items}
            keyExtractor={(item: { nft: NFT; disabled: boolean }) => item.nft.id}
            numColumns={2}
            columnWrapperStyle={{ gap: GRID_GAP }}
            contentContainerStyle={{ padding: GRID_PADDING, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: { item: { nft: NFT; disabled: boolean } }) => {
              const s = breedPickerCard({ disabled: item.disabled })
              const isSelected = lockedId !== undefined && lockedId === item.nft.id
              const hint = item.disabled
                ? isSelected
                  ? 'This NFT is already selected as a parent'
                  : 'This NFT is incompatible as a parent'
                : 'Tap to select as parent'
              return (
                <PressableFeedback
                  onPress={() => {
                    onSelect(item.nft)
                    onClose()
                  }}
                  isDisabled={item.disabled}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: item.disabled, selected: isSelected }}
                  accessibilityLabel={`Select ${formatDisplayName(item.nft.name)}`}
                  accessibilityHint={hint}
                  style={{ width: cardWidth }}
                  className="mb-3"
                >
                  <Card className={s.root()} animation="disable-all">
                    <View className={s.image()}>
                      <Image
                        source={{ uri: item.nft.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      {item.disabled && <View className={s.disabledOverlay()} />}
                      <View
                        className={s.rarityDot()}
                        style={{ backgroundColor: RARITY_COLORS[item.nft.rarity] }}
                      />
                    </View>
                    <View className={s.info()}>
                      <Text className={s.name()} numberOfLines={1}>
                        {formatDisplayName(item.nft.name)}
                      </Text>
                      <Text
                        className={s.rarity()}
                        style={{ color: RARITY_COLORS[item.nft.rarity] }}
                      >
                        {item.nft.rarity}
                      </Text>
                    </View>
                  </Card>
                </PressableFeedback>
              )
            }}
          />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  )
}
