import { MAX_LEVEL, xpThreshold } from '@pop/shared'
import { Card, cn } from 'heroui-native'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { Text, View } from 'react-native'
import BadgeOverlay from '@/components/shared/BadgeOverlay'
import ProgressBar from '@/components/shared/ProgressBar'
import { RemoteImage } from '@/components/styled'
import {
  cardBody,
  cardContainer,
  cardImageContainer,
  cardTitle,
  cardWrapper,
  rarityBadge,
  typeBadge,
  xpBar,
} from '@/styles'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'
import NFTProperties from './NFTProperties'

interface NFTCardProps {
  nft: NFT
  /**
   * Slot for the action area below properties (list button, buy button, price row, etc.).
   * Use a render-prop so call sites can wrap it in `useCallback` and keep `React.memo`
   * effective — a `ReactNode` would change identity on every parent render.
   */
  action?: (nft: NFT) => ReactNode
}

export default memo(function NFTCard({ nft, action }: NFTCardProps) {
  const xpPct =
    nft.level >= MAX_LEVEL ? 100 : Math.min(100, (nft.xp / xpThreshold(nft.level)) * 100)
  const xp = xpBar()

  return (
    <View className={cardWrapper()}>
      <Card
        className={cardContainer()}
        animation="disable-all"
        accessibilityLabel={`${formatDisplayName(nft.name)}, ${nft.rarity ?? 'unknown'} rarity, ${nft.type ?? 'unknown'} type`}
      >
        {/* Image + badge overlay */}
        <Card.Header className={cardImageContainer()}>
          <RemoteImage
            source={{ uri: nft.image_url }}
            blurhash={nft.blurhash ?? undefined}
            className="w-full h-full"
            contentFit="cover"
            accessible={false}
          />
          <BadgeOverlay position="topLeft" colorClass="bg-badge-level">
            {`Lv ${nft.level}`}
          </BadgeOverlay>

          {nft.type && (
            <BadgeOverlay position="topRight" colorClass={typeBadge({ type: nft.type })}>
              {nft.type.toUpperCase()}
            </BadgeOverlay>
          )}

          {nft.rarity && (
            <BadgeOverlay position="bottomLeft" colorClass={rarityBadge({ rarity: nft.rarity })}>
              {nft.rarity.toUpperCase()}
            </BadgeOverlay>
          )}

          {nft.isListed && (
            <BadgeOverlay position="topRightOffset" chipColor="success">
              Listed
            </BadgeOverlay>
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
              <ProgressBar
                value={xpPct}
                colorClass="bg-app-amber"
                size="sm"
                className="bg-surface-container-low"
              />
            </View>
          </View>
          {action?.(nft)}
        </Card.Body>
      </Card>
    </View>
  )
})
