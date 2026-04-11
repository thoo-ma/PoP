import { Chip, PressableFeedback } from 'heroui-native'
import { Image, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { RARITY_COLORS } from '@/constants'
import { badgeLabel, parentSlot } from '@/styles'
import type { NFT } from '@/types/nft'
import { formatDisplayName } from '@/utils'

interface BreedParentSlotProps {
  /** The NFT occupying this slot, or `null` when the slot is empty. */
  nft: NFT | null
  /** Display label shown above the slot (e.g. "Parent 1"). */
  label: string
  /** Called when the user taps the slot to open the picker. */
  onPress: () => void
}

/**
 * Tappable card representing one of the two breed parent slots.
 * Shows the selected NFT's image, name, and rarity border colour,
 * or a placeholder prompt when empty.
 */
export default function BreedParentSlot({ nft, label, onPress }: BreedParentSlotProps) {
  const inactive = useCSSVariable('--color-on-surface-variant') as string
  const borderColor = nft ? RARITY_COLORS[nft.rarity] : inactive
  const s = parentSlot()
  return (
    <PressableFeedback onPress={onPress} className={s.root()} style={{ borderColor }}>
      {nft ? (
        <>
          <Image source={{ uri: nft.image_url }} className={s.image()} resizeMode="cover" />
          <View className={s.info()}>
            <Text className={s.name()} numberOfLines={1}>
              {formatDisplayName(nft.name)}
            </Text>
            <View className={s.chipsRow()}>
              <Chip size="sm" style={{ backgroundColor: RARITY_COLORS[nft.rarity] }}>
                <Chip.Label className={badgeLabel({ size: 'tiny' })}>
                  {nft.rarity.toUpperCase()}
                </Chip.Label>
              </Chip>
            </View>
          </View>
          <View className={s.hintSection()}>
            <Text className={s.hintText()}>tap to change</Text>
          </View>
        </>
      ) : (
        <View className={s.emptyRoot()}>
          <Text className={s.emptyIcon()}>＋</Text>
          <Text className={s.emptyLabel()}>{label}</Text>
        </View>
      )}
    </PressableFeedback>
  )
}
