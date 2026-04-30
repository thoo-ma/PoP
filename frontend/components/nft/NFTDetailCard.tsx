import { memo } from 'react'
import { View } from 'react-native'
import { BadgeOverlay } from '@/components/shared'
import { RemoteImage } from '@/components/styled'
import { Card } from '@/components/ui'
import { cardContainer, cardImageContainer, cardWrapper, nftDetailCard, rarityBadge, typeBadge } from '@/layouts'
import type { NFT } from '@/types'
import { formatDisplayName } from '@/utils'
import NFTProperties from './NFTProperties'

interface NFTDetailCardProps {
  nft: NFT
  /** Override energy value shown in the stat bar. Defaults to `nft.energy`. */
  energy?: number
}

export default memo(function NFTDetailCard({ nft, energy }: NFTDetailCardProps) {
  const s = nftDetailCard()
  return (
    <View className={cardWrapper({ border: 'flat', className: 'w-70 bg-surface' })}>
      <Card
        className={cardContainer()}
        animation="disable-all"
        accessibilityLabel={`${formatDisplayName(nft.name)}, ${nft.rarity ?? 'unknown'} rarity, ${nft.type ?? 'unknown'} type`}
      >
        <Card.Header className={cardImageContainer({ className: 'aspect-auto' })}>
          <RemoteImage
            source={{ uri: nft.image_url }}
            blurhash={nft.blurhash ?? undefined}
            className={s.image()}
            contentFit="cover"
            accessible={false}
          />
          <BadgeOverlay position="topLeft" colorClass="bg-stat-level">
            {`Lv ${nft.level}`}
          </BadgeOverlay>
          <BadgeOverlay position="topRight" colorClass={typeBadge({ type: nft.type })}>
            {nft.type.toUpperCase()}
          </BadgeOverlay>
          {nft.rarity && (
            <BadgeOverlay position="bottomLeft" colorClass={rarityBadge({ rarity: nft.rarity })}>
              {nft.rarity.toUpperCase()}
            </BadgeOverlay>
          )}
        </Card.Header>

        <Card.Body className={s.body()}>
          <Card.Title className={s.title()}>{formatDisplayName(nft.name)}</Card.Title>
          <NFTProperties
            efficiency={nft.efficiency}
            resilience={nft.resilience}
            comfort={nft.comfort}
            luck={nft.luck}
            energy={energy ?? nft.energy}
            mode="compact"
          />
        </Card.Body>
      </Card>
    </View>
  )
})
