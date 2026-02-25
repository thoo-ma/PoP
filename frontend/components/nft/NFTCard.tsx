import { memo } from 'react';
import { Image, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { NFT } from '@/types/nft';
import NFTProperties from './NFTProperties';
import { styles } from '@/styles/nft/NFTCard.styles';
import { formatDisplayName, TYPE_BADGE_STYLES, RARITY_BADGE_STYLES } from '@/utils';

const MAX_LEVEL = 20;

/** Mirror of the edge-function formula — single source of truth is the DB. */
function xpThreshold(level: number): number {
  return Math.max(33, Math.round(25 + level * 5 + Math.pow(level, 2) * 0.3));
}

interface NFTCardProps {
  nft: NFT;
  /** Slot for the action area below properties (list button, buy button, price row, etc.) */
  action?: ReactNode;
}

export default memo(function NFTCard({ nft, action }: NFTCardProps) {
  return (
    <View style={styles.nftCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: nft.image_url }}
          style={styles.nftImage}
          resizeMode="cover"
        />
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv {nft.level}</Text>
        </View>
        {nft.type && (
          <View style={[styles.tierBadge, TYPE_BADGE_STYLES[nft.type]]}>
            <Text style={styles.tierText}>{nft.type.toUpperCase()}</Text>
          </View>
        )}
        {nft.rarity && (
          <View style={[styles.rarityBadge, RARITY_BADGE_STYLES[nft.rarity]]}>
            <Text style={styles.rarityText}>{nft.rarity.toUpperCase()}</Text>
          </View>
        )}
        {nft.isListed && (
          <View style={styles.listedBadge}>
            <Text style={styles.listedText}>Listed</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.nftName}>{formatDisplayName(nft.name)}</Text>
        <NFTProperties
          efficiency={nft.efficiency}
          resilience={nft.resilience}
          comfort={nft.comfort}
          luck={nft.luck}
          energy={nft.energy}
          mode="compact"
        />
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>XP</Text>
          <View style={styles.xpBarWrapper}>
            <View style={styles.xpBarBackground}>
              <View
                style={[
                  styles.xpBarFill,
                  {
                    width: nft.level >= MAX_LEVEL
                      ? '100%'
                      : `${Math.min(100, (nft.xp / xpThreshold(nft.level)) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
        {action}
      </View>
    </View>
  );
});
