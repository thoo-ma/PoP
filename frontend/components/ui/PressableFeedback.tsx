import {
  PressableFeedback as HeroPressableFeedback,
  type PressableFeedbackProps as PressableFeedbackRootProps,
} from 'heroui-native'
import { memo } from 'react'

export type PressableFeedbackProps = PressableFeedbackRootProps

/**
 * Brand-wrapped `PressableFeedback`. Pass-through for now; exists so feature
 * code does not import from `heroui-native` directly. Compound parts (`Scale`,
 * `Highlight`, `Ripple`) pass through unchanged. See
 * `frontend/.instructions.md` § "Sanctioned UI wrappers" for usage rules.
 */
export const PressableFeedback = Object.assign(
  memo(function PressableFeedback(props: PressableFeedbackProps) {
    return <HeroPressableFeedback {...props} />
  }),
  {
    Scale: HeroPressableFeedback.Scale,
    Highlight: HeroPressableFeedback.Highlight,
    Ripple: HeroPressableFeedback.Ripple,
  },
)
