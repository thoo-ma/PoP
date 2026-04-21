import { Chip, cn, PressableFeedback } from 'heroui-native'
import { Text, View } from 'react-native'
import { RemoteImage } from '@/components/styled'
import { useRarityColors } from '@/hooks'
import { badgeLabel, parentSlot } from '@/styles'
import type { NFT } from '@/types'
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
 * Shows the selected NFT's image, name, and rarity chip,
 * or a placeholder prompt when empty.
 */
export default function BreedParentSlot({ nft, label, onPress }: BreedParentSlotProps) {
  const rarityColors = useRarityColors()
  const s = parentSlot()
  const a11yLabel = nft
    ? `${label}: ${formatDisplayName(nft.name)}, ${nft.rarity}`
    : `Choose ${label}`
  return (
    <PressableFeedback
      onPress={onPress}
      className={cn(s.root({ empty: !nft }))}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Tap to change parent"
    >
      {nft ? (
        <>
          <RemoteImage
            source={{ uri: nft.image_url }}
            blurhash={nft.blurhash ?? undefined}
            className={s.image()}
            contentFit="cover"
          />
          <View className={s.info()}>
            <Text className={s.name()} numberOfLines={1}>
              {formatDisplayName(nft.name)}
            </Text>
            <View className={s.chipsRow()}>
              <Chip size="sm" style={{ backgroundColor: rarityColors[nft.rarity] }}>
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
