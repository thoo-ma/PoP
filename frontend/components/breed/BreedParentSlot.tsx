import { TouchableOpacity, View, Text, Image } from 'react-native';
import type { NFT } from '@/types/nft';
import { breedStyles as styles } from '@/styles';
import { RARITY_COLORS } from '@/constants';

interface BreedParentSlotProps {
  nft: NFT | null;
  label: string;
  onPress: () => void;
}

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
          <Image source={{ uri: nft.image }} style={styles.parentImage} resizeMode="cover" />
          <View style={styles.parentInfo}>
            <Text style={styles.parentName} numberOfLines={1}>{nft.name}</Text>
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
