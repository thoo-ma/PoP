import { Modal, View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import type { NFT } from '@/types/nft';
import type { NFTRarity } from '@/types/nft';
import { breedStyles as styles } from '@/styles';
import { RARITY_COLORS } from '@/constants';
import { canBreed } from '@/utils';

const SCREEN_W = Dimensions.get('window').width;
export const TILE_SIZE = (SCREEN_W - 48 - 12) / 2; // 2 columns, 24px side padding, 12px gap

export interface BreedPickerModalProps {
  visible: boolean;
  title: string;
  allNFTs: NFT[];
  lockedId?: string;        // the other slot's NFT — cannot be selected
  lockedRarity?: NFTRarity; // filter compatibility against this rarity
  onSelect: (nft: NFT) => void;
  onClose: () => void;
}

export default function BreedPickerModal({
  visible, title, allNFTs, lockedId, lockedRarity, onSelect, onClose,
}: BreedPickerModalProps) {
  const items = allNFTs.map((nft) => ({
    nft,
    disabled:
      nft.id === lockedId ||
      (lockedRarity !== undefined && !canBreed(lockedRarity, nft.rarity)),
  }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          {lockedRarity && (
            <Text style={styles.modalSubtitle}>
              Greyed-out NFTs are incompatible with your first selection.
            </Text>
          )}
          <FlatList
            data={items}
            keyExtractor={(item) => item.nft.id}
            numColumns={2}
            columnWrapperStyle={styles.pickerRow}
            contentContainerStyle={styles.pickerGrid}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.pickerTile, item.disabled && styles.pickerTileDisabled]}
                onPress={() => { if (!item.disabled) { onSelect(item.nft); onClose(); } }}
                activeOpacity={item.disabled ? 1 : 0.7}
              >
                <Image source={{ uri: item.nft.image }} style={styles.pickerImage} resizeMode="cover" />
                {item.disabled && <View style={styles.pickerDimOverlay} />}
                <View style={[styles.pickerRarityDot, { backgroundColor: RARITY_COLORS[item.nft.rarity] }]} />
                <Text style={[styles.pickerName, item.disabled && styles.pickerNameDisabled]} numberOfLines={1}>
                  {item.nft.name}
                </Text>
                <Text style={[styles.pickerRarityLabel, { color: RARITY_COLORS[item.nft.rarity] }]}>
                  {item.nft.rarity}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
