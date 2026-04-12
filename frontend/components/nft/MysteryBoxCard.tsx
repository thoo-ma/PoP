import type { MysteryBox } from '@pop/shared'
import { Card, Chip, cn } from 'heroui-native'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { Image, View } from 'react-native'
import { useRarityColors } from '@/hooks'
import { badgeLabel, badgePosition, cardBody, cardContainer, cardImageContainer } from '@/styles'

interface MysteryBoxCardProps {
  box: MysteryBox
  /** Number of boxes of this rarity. When > 1, a count badge is shown. */
  count?: number
  /** Slot for the action area below the card header (e.g. an Open button). */
  action?: ReactNode
}

export default memo(function MysteryBoxCard({ box, count, action }: MysteryBoxCardProps) {
  const rarityColors = useRarityColors()
  return (
    <Card
      className={cardContainer()}
      animation="disable-all"
      accessibilityLabel={`Mystery box, ${box.rarity} rarity${count !== undefined && count > 0 ? `, quantity ${count}` : ''}`}
    >
      <Card.Header className={cardImageContainer()}>
        <Image source={{ uri: box.image_url }} className="w-full h-full" resizeMode="cover" />

        {/* Opened — top-right */}
        {box.opened && (
          <Chip
            size="sm"
            variant="secondary"
            className={badgePosition({ position: 'topRight' })}
            animation="disable-all"
          >
            <Chip.Label className={cn(badgeLabel(), 'font-bold')}>Opened</Chip.Label>
          </Chip>
        )}
      </Card.Header>

      <Card.Body className={cardBody()}>
        <View className="flex-row items-center gap-2">
          {count !== undefined && count > 0 && (
            <Chip size="sm" variant="primary" animation="disable-all">
              <Chip.Label className={badgeLabel({ size: 'base' })}>×{count}</Chip.Label>
            </Chip>
          )}
          <Chip
            size="sm"
            variant="primary"
            style={{ backgroundColor: rarityColors[box.rarity] }}
            animation="disable-all"
          >
            <Chip.Label className={badgeLabel()}>{box.rarity.toUpperCase()}</Chip.Label>
          </Chip>
        </View>
        {action}
      </Card.Body>
    </Card>
  )
})
