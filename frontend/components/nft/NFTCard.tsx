import { memo } from 'react';
import { Image, View, Text } from 'react-native';
import type { ReactNode } from 'react';
import { Card, Chip } from 'heroui-native';
import type { NFT } from '@/types/nft';
import NFTProperties from './NFTProperties';
import { formatDisplayName, TYPE_BADGE_STYLES } from '@/utils';
import { RARITY_COLORS } from '@/constants';
import { MAX_LEVEL, xpThreshold } from '@shared/xp';

interface NFTCardProps {
  nft: NFT;
  /** Slot for the action area below properties (list button, buy button, price row, etc.) */
  action?: ReactNode;
}

export default memo(function NFTCard({ nft, action }: NFTCardProps) {
  const xpPct = nft.level >= MAX_LEVEL
    ? 100
    : Math.min(100, (nft.xp / xpThreshold(nft.level)) * 100);

  return (
    <Card className="w-full mb-4" animation="disable-all">
      {/* Image + badge overlay */}
      <View className="w-full aspect-square relative">
        <Image
          source={{ uri: nft.image_url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Level — top-left */}
        <Chip
          size="sm"
          variant="primary"
          className="absolute top-2 left-2"
          animation="disable-all"
        >
          <Chip.Label className="text-white text-xs font-bold">Lv {nft.level}</Chip.Label>
        </Chip>

        {/* Type — bottom-left */}
        {nft.type && (
          <Chip
            size="sm"
            variant="primary"
            style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: (TYPE_BADGE_STYLES[nft.type] as { backgroundColor: string }).backgroundColor }}
            animation="disable-all"
          >
            <Chip.Label className="text-white text-xs font-bold">{nft.type.toUpperCase()}</Chip.Label>
          </Chip>
        )}

        {/* Rarity — top-right */}
        {nft.rarity && (
          <Chip
            size="sm"
            variant="primary"
            style={{ position: 'absolute', top: 8, right: 8, backgroundColor: RARITY_COLORS[nft.rarity] }}
            animation="disable-all"
          >
            <Chip.Label className="text-white text-xs font-bold">{nft.rarity.toUpperCase()}</Chip.Label>
          </Chip>
        )}

        {/* Listed — below rarity */}
        {nft.isListed && (
          <Chip
            size="sm"
            variant="primary"
            color="success"
            className="absolute right-2"
            style={{ position: 'absolute', top: 40, right: 8 }}
            animation="disable-all"
          >
            <Chip.Label className="text-white text-xs font-bold">Listed</Chip.Label>
          </Chip>
        )}

        {/* Stat points — bottom-right */}
        {(nft.stat_points ?? 0) > 0 && (
          <Chip
            size="sm"
            variant="primary"
            style={{ position: 'absolute', bottom: 8, right: 8 }}
            animation="disable-all"
          >
            <Chip.Label className="text-white text-xs font-bold">+{nft.stat_points} pts</Chip.Label>
          </Chip>
        )}
      </View>

      <Card.Body className="p-2 gap-2">
        <Card.Title className="text-sm font-bold" style={{ minHeight: 32 }}>
          {formatDisplayName(nft.name)}
        </Card.Title>
        <NFTProperties
          efficiency={nft.efficiency}
          resilience={nft.resilience}
          comfort={nft.comfort}
          luck={nft.luck}
          energy={nft.energy}
          mode="compact"
        />
        {/* XP bar */}
        <View className="flex-row items-center mt-1">
          <Text className="text-xs font-semibold w-5" style={{ color: '#f59e0b' }}>XP</Text>
          <View className="flex-1 mx-1">
            <View className="h-1 rounded-full overflow-hidden bg-gray-200">
              <View
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${xpPct}%` }}
              />
            </View>
          </View>
        </View>
        {action}
      </Card.Body>
    </Card>
  );
});
