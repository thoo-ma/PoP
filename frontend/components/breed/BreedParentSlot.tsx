import { View, Text, Image } from 'react-native';
import { PressableFeedback, Chip } from 'heroui-native';
import type { NFT } from '@/types/nft';
import { RARITY_COLORS, colors } from '@/constants';
import { formatDisplayName } from '@/utils';

interface BreedParentSlotProps {
  /** The NFT occupying this slot, or `null` when the slot is empty. */
  nft: NFT | null;
  /** Display label shown above the slot (e.g. "Parent 1"). */
  label: string;
  /** Called when the user taps the slot to open the picker. */
  onPress: () => void;
}

/**
 * Tappable card representing one of the two breed parent slots.
 * Shows the selected NFT's image, name, and rarity border colour,
 * or a placeholder prompt when empty.
 */
export default function BreedParentSlot({ nft, label, onPress }: BreedParentSlotProps) {
  const borderColor = nft ? RARITY_COLORS[nft.rarity] : colors.inactive;
  return (
    <PressableFeedback
      onPress={onPress}
      style={{ flex: 1, borderRadius: 14, borderWidth: 2, borderColor, overflow: 'hidden' }}
      className="bg-content1 shadow-sm"
    >
      {nft ? (
        <>
          <Image
            source={{ uri: nft.image_url }}
            style={{ width: '100%', aspectRatio: 1 }}
            resizeMode="cover"
          />
          <View className="p-2 pb-1">
            <Text className="text-[13px] font-bold text-foreground mb-1" numberOfLines={1}>
              {formatDisplayName(nft.name)}
            </Text>
            <View className="flex-row gap-1">
              <Chip size="sm" style={{ backgroundColor: RARITY_COLORS[nft.rarity] }}>
                <Chip.Label className="text-white text-[10px] font-bold">
                  {nft.rarity.toUpperCase()}
                </Chip.Label>
              </Chip>
            </View>
          </View>
          <View className="px-2 pb-2">
            <Text className="text-xs text-default-400 italic">tap to change</Text>
          </View>
        </>
      ) : (
        <View className="aspect-square justify-center items-center bg-default-100">
          <Text className="text-[36px] text-default-300 mb-1.5">＋</Text>
          <Text className="text-sm text-default-500 text-center px-4 leading-4">{label}</Text>
        </View>
      )}
    </PressableFeedback>
  );
}
