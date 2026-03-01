import { Modal, View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import type { NFT } from '@/types';
import type { NFTRarity } from '@shared';
import { breedStyles as styles } from '@/styles';
import { RARITY_COLORS } from '@/constants';
import { canBreed, formatDisplayName } from '@/utils';

export interface BreedPickerModalProps {
  /** Controls modal visibility. */
  visible: boolean;
  /** Title displayed at the top of the sheet (e.g. "Choose Parent 1"). */
  title: string;
  /** Full NFT collection to show as selectable items. */
  allNFTs: NFT[];
  /** ID of the NFT already chosen in the other slot — rendered as disabled. */
  lockedId?: string;
  /** Rarity of the other slot's NFT — items incompatible with it are disabled. */
  lockedRarity?: NFTRarity;
  /** Called with the chosen NFT when the user taps a valid row. */
  onSelect: (nft: NFT) => void;
  /** Called when the user dismisses the sheet without selecting. */
  onClose: () => void;
}

/**
 * Bottom-sheet modal for picking an NFT to place in a breed parent slot.
 * Items that conflict with `lockedId` or are incompatible with `lockedRarity`
 * are shown greyed-out and non-interactive.
 */
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
                <Image source={{ uri: item.nft.image_url }} style={styles.pickerImage} resizeMode="cover" />
                {item.disabled && <View style={styles.pickerDimOverlay} />}
                <View style={[styles.pickerRarityDot, { backgroundColor: RARITY_COLORS[item.nft.rarity] }]} />
                <Text style={[styles.pickerName, item.disabled && styles.pickerNameDisabled]} numberOfLines={1}>
                  {formatDisplayName(item.nft.name)}
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
