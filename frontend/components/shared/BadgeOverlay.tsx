import type { ReactNode } from 'react'
import { memo } from 'react'
import { Chip, type ChipColor, type ChipVariant, cn } from '@/components/ui'
import { badgeLabel, badgePosition } from '@/layouts'

type BadgePositionVariant = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'topRightOffset'
type BadgeLabelSize = 'base' | 'xs' | 'sm' | 'tiny'

interface BadgeOverlayProps {
  /** Which corner to position the badge at. */
  position: BadgePositionVariant
  /** Static bg-* className for the badge background (e.g. typeBadge(), rarityBadge()). */
  colorClass?: string
  /** HeroUI Chip `color` prop (e.g. "success"). */
  chipColor?: ChipColor
  /** HeroUI Chip `variant` prop. Defaults to "primary". */
  chipVariant?: ChipVariant
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
  chipVariant = 'primary',
  labelSize = 'xs',
  className,
  children,
}: BadgeOverlayProps) {
  return (
    <Chip
      size="sm"
      variant={chipVariant}
      color={chipColor}
      className={cn(badgePosition({ position }), colorClass, className)}
      animation="disable-all"
    >
      <Chip.Label className={badgeLabel({ size: labelSize })}>{children}</Chip.Label>
    </Chip>
  )
})
