import { Image, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { NFT } from '../types/nft';
import NFTProperties from './NFTProperties';
import { colors } from '../constants';

interface NFTCardProps {
  nft: NFT;
  /** Slot for the action area below properties (list button, buy button, price row, etc.) */
  action?: ReactNode;
}

export default function NFTCard({ nft, action }: NFTCardProps) {
  return (
    <View style={styles.nftCard}>
      <View style={styles.imageContainer}>
        <Image
          source={typeof nft.image === 'string' ? { uri: nft.image } : nft.image}
          style={styles.nftImage}
          resizeMode="cover"
        />
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv {nft.level}</Text>
        </View>
        {nft.tier && (
          <View style={[styles.tierBadge, styles[`${nft.tier}Badge` as keyof typeof styles] as object]}>
            <Text style={styles.tierText}>{nft.tier.toUpperCase()}</Text>
          </View>
        )}
        {nft.rarity && (
          <View style={[styles.rarityBadge, styles[`${nft.rarity}Badge` as keyof typeof styles] as object]}>
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
        <Text style={styles.nftName}>{nft.name}</Text>
        <NFTProperties
          efficiency={nft.efficiency}
          resilience={nft.resilience}
          comfort={nft.comfort}
          luck={nft.luck}
          mode="compact"
        />
        {action}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nftCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.bgSurface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  nftImage: {
    width: '100%',
    aspectRatio: 1,
  },
  levelBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.bgOverlay,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  tierBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tierText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.bgSurface,
  },
  rarityBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.bgSurface,
  },
  listedBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: colors.buttonSuccess,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  listedText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.bgSurface,
  },
  cardContent: {
    padding: 8,
  },
  nftName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 4,
  },
  // Tier badge variants
  'cruise-seatBadge': { backgroundColor: '#94a3b8' },
  'turbo-flushBadge': { backgroundColor: '#f59e0b' },
  'zen-fortressBadge': { backgroundColor: '#8b5cf6' },
  // Rarity badge variants
  commonBadge: { backgroundColor: '#94a3b8' },
  rareBadge: { backgroundColor: '#3b82f6' },
  legendaryBadge: { backgroundColor: '#f59e0b' },
  transcendentBadge: { backgroundColor: '#a855f7' },
});
