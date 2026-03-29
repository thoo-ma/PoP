import { memo } from 'react'
import { Image, View, Text } from 'react-native'
import type { ReactNode } from 'react'
import { Card, Chip, cn } from 'heroui-native'
import type { NFT } from '@/types/nft'
import NFTProperties from './NFTProperties'
import { formatDisplayName } from '@/utils'
import { MAX_LEVEL, xpThreshold } from '@pop/shared/xp'
import {
  badgeLabel,
  cardImageContainer,
  badgePosition,
  cardBody,
  typeBadge,
  rarityBadge,
} from '@/styles'

interface NFTCardProps {
  nft: NFT
  /** Slot for the action area below properties (list button, buy button, price row, etc.) */
  action?: ReactNode
}

export default memo(function NFTCard({ nft, action }: NFTCardProps) {
  const xpPct =
    nft.level >= MAX_LEVEL ? 100 : Math.min(100, (nft.xp / xpThreshold(nft.level)) * 100)

  return (
    <Card className="w-full mb-4 overflow-hidden p-0" animation="disable-all">
      {/* Image + badge overlay */}
      <View className={cardImageContainer()}>
        <Image source={{ uri: nft.image_url }} className="w-full h-full" resizeMode="cover" />
        {/* Level — top-left */}
        <Chip
          size="sm"
          variant="primary"
          className={badgePosition({ position: 'topLeft' })}
          animation="disable-all"
        >
          <Chip.Label className={badgeLabel()}>Lv {nft.level}</Chip.Label>
        </Chip>

        {/* Type — bottom-left */}
        {nft.type && (
          <Chip
            size="sm"
            variant="primary"
            className={cn(badgePosition({ position: 'bottomLeft' }), typeBadge({ type: nft.type }))}
            animation="disable-all"
          >
            <Chip.Label className={badgeLabel()}>{nft.type.toUpperCase()}</Chip.Label>
          </Chip>
        )}

        {/* Rarity — top-right */}
        {nft.rarity && (
          <Chip
            size="sm"
            variant="primary"
            className={cn(
              badgePosition({ position: 'topRight' }),
              rarityBadge({ rarity: nft.rarity }),
            )}
            animation="disable-all"
          >
            <Chip.Label className={badgeLabel()}>{nft.rarity.toUpperCase()}</Chip.Label>
          </Chip>
        )}

        {/* Listed — below rarity */}
        {nft.isListed && (
          <Chip
            size="sm"
            variant="primary"
            color="success"
            className={badgePosition({ position: 'topRightOffset' })}
            animation="disable-all"
          >
            <Chip.Label className={badgeLabel()}>Listed</Chip.Label>
          </Chip>
        )}

        {/* Stat points — bottom-right */}
        {(nft.stat_points ?? 0) > 0 && (
          <Chip
            size="sm"
            variant="primary"
            className={badgePosition({ position: 'bottomRight' })}
            animation="disable-all"
          >
            <Chip.Label className={badgeLabel()}>+{nft.stat_points} pts</Chip.Label>
          </Chip>
        )}
      </View>

      <Card.Body className={cardBody()}>
        <Card.Title className="text-sm font-bold min-h-8">{formatDisplayName(nft.name)}</Card.Title>
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
          <Text className="text-xs font-semibold w-5 text-stat-comfort">XP</Text>
          <View className="flex-1 mx-1">
            <View className="h-1 rounded-full overflow-hidden bg-gray-200">
              <View className="h-full rounded-full bg-yellow-400" style={{ width: `${xpPct}%` }} />
            </View>
          </View>
        </View>
        {action}
      </Card.Body>
    </Card>
  )
})
