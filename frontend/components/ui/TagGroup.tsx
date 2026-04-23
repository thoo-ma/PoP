import {
  TagGroup as HeroTagGroup,
  type TagGroupItemLabelProps,
  type TagGroupItemProps,
  type TagGroupItemRemoveButtonProps,
  type TagGroupListProps,
  type TagGroupProps,
  type TagGroupSize,
  type TagGroupVariant,
} from 'heroui-native'
import { memo } from 'react'

export type {
  TagGroupItemLabelProps,
  TagGroupItemProps,
  TagGroupItemRemoveButtonProps,
  TagGroupListProps,
  TagGroupProps,
  TagGroupSize,
  TagGroupVariant,
}

/**
 * Brand-wrapped `TagGroup`. Pass-through wrapper so feature code does not import
 * from `heroui-native` directly.
 * See `frontend/.instructions.md` § "Sanctioned UI wrappers" for usage rules.
 */
export const TagGroup = Object.assign(
  memo(function TagGroup(props: TagGroupProps) {
    return <HeroTagGroup {...props} />
  }),
  {
    List: HeroTagGroup.List,
    Item: HeroTagGroup.Item,
    ItemLabel: HeroTagGroup.ItemLabel,
    ItemRemoveButton: HeroTagGroup.ItemRemoveButton,
  },
)
