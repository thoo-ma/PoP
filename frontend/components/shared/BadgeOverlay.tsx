import type { ChipColor } from 'heroui-native'
import { Chip, cn } from 'heroui-native'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { badgeLabel, badgePosition } from '@/styles'

type BadgePositionVariant = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'topRightOffset'
type BadgeLabelSize = 'base' | 'xs' | 'sm' | 'tiny'

interface BadgeOverlayProps {
  /** Which corner to position the badge at. */
  position: BadgePositionVariant
  /** Static bg-* className for the badge background (e.g. typeBadge(), rarityBadge()). */
  colorClass?: string
  /** HeroUI Chip `color` prop (e.g. "success"). */
  chipColor?: ChipColor
  /** Badge label text size variant. */
  labelSize?: BadgeLabelSize
  /** Extra className merged onto the Chip. */
  className?: string
  /** Badge text content. */
  children: ReactNode
}

export default memo(function BadgeOverlay({
  position,
  colorClass,
  chipColor,
  labelSize = 'xs',
  className,
  children,
}: BadgeOverlayProps) {
  return (
    <Chip
      size="sm"
      variant="primary"
      color={chipColor}
      className={cn(badgePosition({ position }), colorClass, className)}
      animation="disable-all"
    >
      <Chip.Label className={badgeLabel({ size: labelSize })}>{children}</Chip.Label>
    </Chip>
  )
})
