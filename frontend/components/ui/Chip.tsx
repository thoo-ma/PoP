import {
  type ChipColor,
  type ChipProps as ChipRootProps,
  type ChipVariant,
  Chip as HeroChip,
} from 'heroui-native'
import { memo } from 'react'

export type { ChipColor, ChipVariant }
export type ChipProps = ChipRootProps

/**
 * Brand-wrapped `Chip`. Pass-through for now; exists so feature code does not
 * import from `heroui-native` directly. Compound part (`Label`) passes through
 * unchanged. See `frontend/.instructions.md` § "Sanctioned UI wrappers" for
 * usage rules.
 */
export const Chip = Object.assign(
  memo(function Chip(props: ChipProps) {
    return <HeroChip {...props} />
  }),
  {
    Label: HeroChip.Label,
  },
)
