import { TouchableOpacity, View, Text, Image } from 'react-native';
import type { NFT } from '@/types/nft';
import { breedStyles as styles } from '@/styles';
import { RARITY_COLORS } from '@/constants';
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
  const borderColor = nft ? RARITY_COLORS[nft.rarity] : '#d1d5db';
  return (
    <TouchableOpacity
      style={[styles.parentSlot, { borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {nft ? (
        <>
          <Image source={{ uri: nft.image_url }} style={styles.parentImage} resizeMode="cover" />
          <View style={styles.parentInfo}>
            <Text style={styles.parentName} numberOfLines={1}>{formatDisplayName(nft.name)}</Text>
            <View style={styles.parentBadgeRow}>
              <View style={[styles.parentRarityBadge, { backgroundColor: RARITY_COLORS[nft.rarity] }]}>
                <Text style={styles.parentRarityText}>{nft.rarity.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.parentChangeHint}>
            <Text style={styles.parentChangeText}>tap to change</Text>
          </View>
        </>
      ) : (
        <View style={styles.emptySlotInner}>
          <Text style={styles.emptySlotPlus}>＋</Text>
          <Text style={styles.emptySlotLabel}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
