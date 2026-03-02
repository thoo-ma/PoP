import { memo } from 'react';
import { Image, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { MysteryBox } from '@shared';
import { styles } from '@/styles/nft/MysteryBoxCard.styles';
import { RARITY_BADGE_STYLES } from '@/utils';

interface MysteryBoxCardProps {
  box: MysteryBox;
  /** Number of boxes of this rarity. When > 1, a count badge is shown. */
  count?: number;
  /** Slot for the action area below the card header (e.g. an Open button). */
  action?: ReactNode;
}

export default memo(function MysteryBoxCard({ box, count, action }: MysteryBoxCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: box.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.rarityBadge, RARITY_BADGE_STYLES[box.rarity]]}>
          <Text style={styles.rarityText}>{box.rarity.toUpperCase()}</Text>
        </View>
        {count !== undefined && count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>×{count}</Text>
          </View>
        )}
        {box.opened && (
          <View style={styles.openedBadge}>
            <Text style={styles.openedText}>Opened</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Mystery Box</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>MYSTERY BOX</Text>
        </View>
        {action}
      </View>
    </View>
  );
});
