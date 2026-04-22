import type { MysteryBox, NFTRarity } from '@pop/shared'
import { Card, Chip, cn } from 'heroui-native'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { View } from 'react-native'
import BadgeOverlay from '@/components/shared/BadgeOverlay'
import { RemoteImage } from '@/components/styled'
import { useRarityColors } from '@/hooks'
import { badgeLabel, cardBody, cardContainer, cardImageContainer, cardWrapper } from '@/styles'

interface MysteryBoxCardProps {
  /** The rarity this card slot represents. */
  rarity: NFTRarity
  /** The actual box object. Null when the player has 0 boxes of this rarity. */
  box: MysteryBox | null
  /** Image URL for the mystery box (always provided, even when count is 0). */
  imageUrl: string
  /** Optional blurhash for the mystery-box image. */
  blurhash?: string | null
  /** Number of boxes of this rarity. Always shown, including 0. */
  count?: number
  /** Slot for the action area below the card header (e.g. an Open button). */
  action?: ReactNode
}

export default memo(function MysteryBoxCard({
  rarity,
  box,
  imageUrl,
  blurhash,
  count,
  action,
}: MysteryBoxCardProps) {
  const rarityColors = useRarityColors()
  const isEmpty = count === 0
  return (
    <View className={cn(cardWrapper(), isEmpty && 'opacity-disabled-heavy')}>
      <Card
        className={cardContainer()}
        animation="disable-all"
        accessibilityLabel={`Mystery box, ${rarity} rarity${count !== undefined && count > 0 ? `, quantity ${count}` : ', unavailable'}`}
      >
        <Card.Header className={cardImageContainer()}>
          <RemoteImage
            source={{ uri: imageUrl }}
            blurhash={blurhash ?? undefined}
            className="w-full h-full"
            contentFit="cover"
            accessible={false}
          />

          {/* Opened — top-right */}
          {box?.opened && (
            <BadgeOverlay position="topRight" chipVariant="secondary">
              Opened
            </BadgeOverlay>
          )}
        </Card.Header>

        <Card.Body className={cardBody()}>
          <View className="flex-row items-center gap-2">
            {count !== undefined && (
              <Chip size="sm" variant="primary" animation="disable-all">
                <Chip.Label className={badgeLabel({ size: 'xs' })}>×{count}</Chip.Label>
              </Chip>
            )}
            <Chip
              size="sm"
              variant="primary"
              style={{ backgroundColor: rarityColors[rarity] }}
              animation="disable-all"
            >
              <Chip.Label className={badgeLabel({ size: 'xs' })}>{rarity.toUpperCase()}</Chip.Label>
            </Chip>
          </View>
          {action}
        </Card.Body>
      </Card>
    </View>
  )
})
