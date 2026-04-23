import {
  Select as HeroSelect,
  type SelectContentProps,
  type SelectItemDescriptionProps,
  type SelectItemIndicatorProps,
  type SelectItemLabelProps,
  type SelectItemProps,
  type SelectListLabelProps,
  type SelectOverlayProps,
  type SelectPortalProps,
  type SelectRootProps,
  type SelectTriggerIndicatorProps,
  type SelectTriggerProps,
  type SelectValueProps,
} from 'heroui-native'
import { memo } from 'react'

export type {
  SelectContentProps,
  SelectItemDescriptionProps,
  SelectItemIndicatorProps,
  SelectItemLabelProps,
  SelectItemProps,
  SelectListLabelProps,
  SelectOverlayProps,
  SelectPortalProps,
  SelectRootProps,
  SelectTriggerIndicatorProps,
  SelectTriggerProps,
  SelectValueProps,
}
export type SelectProps<M extends 'single' | 'multiple' = 'single'> = SelectRootProps<M>

/**
 * Brand-wrapped `Select`. Pass-through wrapper so feature code does not import
 * from `heroui-native` directly.
 * See `frontend/.instructions.md` § "Sanctioned UI wrappers" for usage rules.
 */
export const Select = Object.assign(
  memo(function Select<M extends 'single' | 'multiple' = 'single'>(props: SelectProps<M>) {
    return <HeroSelect {...props} />
  }),
  {
    Trigger: HeroSelect.Trigger,
    Value: HeroSelect.Value,
    TriggerIndicator: HeroSelect.TriggerIndicator,
    Portal: HeroSelect.Portal,
    Overlay: HeroSelect.Overlay,
    Content: HeroSelect.Content,
    Item: HeroSelect.Item,
    ItemLabel: HeroSelect.ItemLabel,
    ItemDescription: HeroSelect.ItemDescription,
    ItemIndicator: HeroSelect.ItemIndicator,
    ListLabel: HeroSelect.ListLabel,
    Close: HeroSelect.Close,
  },
)
