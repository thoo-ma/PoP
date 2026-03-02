import { memo } from 'react';
import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import type { NFT } from '@/types/nft';
import { RARITY_BADGE_STYLES } from '@/utils';
import { formatDisplayName } from '@/utils';
import { styles } from '@/styles/nft/MysteryBoxRevealModal.styles';

interface MysteryBoxRevealModalProps {
  visible: boolean;
  /** The newly minted toilet NFT — must be non-null when `visible` is true. */
  nft: NFT | null;
  onClose: () => void;
}

/**
 * Celebrate the result of opening a mystery box.
 * Displays the newly minted toilet's image, name and rarity,
 * then lets the user dismiss to return to the vault.
 */
export default memo(function MysteryBoxRevealModal({ visible, nft, onClose }: MysteryBoxRevealModalProps) {
  if (!nft) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.header}>You got a toilet! 🚽</Text>
          <Text style={styles.subtitle}>Your mystery box has been opened</Text>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: nft.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.rarityBadge, RARITY_BADGE_STYLES[nft.rarity]]}>
              <Text style={styles.rarityText}>{nft.rarity.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.nftName}>{formatDisplayName(nft.name)}</Text>
          <Text style={styles.nftType}>{nft.type.replace(/-/g, ' ')}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close reveal and return to vault"
          >
            <Text style={styles.closeButtonText}>View in Vault</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});
