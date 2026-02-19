import { memo } from 'react';
import { Image, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { NFT } from '../../types/nft';
import NFTProperties from './NFTProperties';
import { styles } from '../../styles/nft/NFTCard.styles';

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
});
