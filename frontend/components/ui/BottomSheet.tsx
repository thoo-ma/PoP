import { type BottomSheetRootProps, BottomSheet as HeroBottomSheet } from 'heroui-native'
import { memo } from 'react'

export type BottomSheetProps = BottomSheetRootProps

/**
 * Brand-wrapped `BottomSheet`. Pass-through for now; exists so feature code
 * does not import from `heroui-native` directly. Compound parts (`Trigger`,
 * `Portal`, `Overlay`, `Content`, `Close`, `Title`, `Description`) pass
 * through unchanged. See `frontend/.instructions.md` § "Sanctioned UI
 * wrappers" for usage rules.
 */
export const BottomSheet = Object.assign(
  memo(function BottomSheet(props: BottomSheetProps) {
    return <HeroBottomSheet {...props} />
  }),
  {
    Trigger: HeroBottomSheet.Trigger,
    Portal: HeroBottomSheet.Portal,
    Overlay: HeroBottomSheet.Overlay,
    Content: HeroBottomSheet.Content,
    Close: HeroBottomSheet.Close,
    Title: HeroBottomSheet.Title,
    Description: HeroBottomSheet.Description,
  },
)
