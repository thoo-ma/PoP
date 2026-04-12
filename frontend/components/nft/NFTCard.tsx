import { MAX_LEVEL, xpThreshold } from '@pop/shared/xp'
import { Card, Chip, cn } from 'heroui-native'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { Image, Text, View } from 'react-native'
import {
  badgeLabel,
  badgePosition,
  cardBody,
  cardContainer,
  cardImageContainer,
  cardTitle,
  rarityBadge,
  typeBadge,
  xpBar,
} from '@/styles'
import type { NFT } from '@/types/nft'
import { formatDisplayName } from '@/utils'
import NFTProperties from './NFTProperties'

interface NFTCardProps {
  nft: NFT
  /** Slot for the action area below properties (list button, buy button, price row, etc.) */
  action?: ReactNode
}

export default memo(function NFTCard({ nft, action }: NFTCardProps) {
  const xpPct =
    nft.level >= MAX_LEVEL ? 100 : Math.min(100, (nft.xp / xpThreshold(nft.level)) * 100)
  const xp = xpBar()

  return (
    <Card
      className={cardContainer()}
      animation="disable-all"
      accessibilityLabel={`${formatDisplayName(nft.name)}, ${nft.rarity ?? 'unknown'} rarity, ${nft.type ?? 'unknown'} type`}
    >
      {/* Image + badge overlay */}
      <Card.Header className={cardImageContainer()}>
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
      </Card.Header>

      <Card.Body className={cardBody()}>
        <Card.Title className={cn(cardTitle(), 'min-h-8')}>
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
        <View className={xp.row()}>
          <Text className={xp.label()}>XP</Text>
          <View className={xp.track()}>
            <View className={xp.bg()}>
              <View className={xp.fill()} style={{ width: `${xpPct}%` }} />
            </View>
          </View>
        </View>
        {action}
      </Card.Body>
    </Card>
  )
})
