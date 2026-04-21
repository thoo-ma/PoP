import { Card, PressableFeedback } from 'heroui-native'
import { memo } from 'react'
import { Text, View } from 'react-native'
import { RemoteImage } from '@/components/styled'
import { useRarityColors } from '@/hooks'
import { breedPickerCard } from '@/styles'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'

interface BreedPickerItemCardProps {
  nft: NFT
  disabled: boolean
  /** True when this NFT is already occupying the other parent slot. */
  isSelected: boolean
  width: number
  onPress: () => void
}

export default memo(function BreedPickerItemCard({
  nft,
  disabled,
  isSelected,
  width,
  onPress,
}: BreedPickerItemCardProps) {
  const rarityColors = useRarityColors()
  const s = breedPickerCard({ disabled })
  const hint = disabled
    ? isSelected
      ? 'This NFT is already selected as a parent'
      : 'This NFT is incompatible as a parent'
    : 'Tap to select as parent'

  return (
    <PressableFeedback
      onPress={onPress}
      isDisabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isSelected }}
      accessibilityLabel={`Select ${formatDisplayName(nft.name)}`}
      accessibilityHint={hint}
      style={{ width }}
      className="mb-3"
    >
      <View className={s.wrapper()}>
        <Card className={s.root()} animation="disable-all">
          <View className={s.image()}>
            <RemoteImage
              source={{ uri: nft.image_url }}
              className="w-full h-full"
              contentFit="cover"
            />
            {disabled && <View className={s.disabledOverlay()} />}
            <View className={s.rarityDot()} style={{ backgroundColor: rarityColors[nft.rarity] }} />
          </View>
          <View className={s.info()}>
            <Text className={s.name()} numberOfLines={1}>
              {formatDisplayName(nft.name)}
            </Text>
            <Text className={s.rarity()} style={{ color: rarityColors[nft.rarity] }}>
              {nft.rarity}
            </Text>
          </View>
        </Card>
      </View>
    </PressableFeedback>
  )
})
