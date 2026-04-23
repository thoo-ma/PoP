import {
  type AlertContentProps,
  type AlertDescriptionProps,
  type AlertIndicatorProps,
  type AlertRootProps,
  type AlertTitleProps,
  Alert as HeroAlert,
} from 'heroui-native'
import { memo } from 'react'

export type {
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertRootProps,
  AlertTitleProps,
}
export type AlertProps = AlertRootProps

/**
 * Brand-wrapped `Alert`. Pass-through wrapper so feature code does not import
 * from `heroui-native` directly.
 * See `frontend/.instructions.md` § "Sanctioned UI wrappers" for usage rules.
 */
export const Alert = Object.assign(
  memo(function Alert(props: AlertProps) {
    return <HeroAlert {...props} />
  }),
  {
    Indicator: HeroAlert.Indicator,
    Content: HeroAlert.Content,
    Title: HeroAlert.Title,
    Description: HeroAlert.Description,
  },
)
