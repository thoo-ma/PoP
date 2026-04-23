import { type ButtonRootProps, cn, Button as HeroButton } from 'heroui-native'
import { memo } from 'react'

export type ButtonProps = ButtonRootProps

/**
 * Brand-wrapped `Button`. Bakes the tactile raise (`border-b-raise` →
 * `border-b-press` + `translateY(3px)` on press) into every instance.
 * See `frontend/.instructions.md` § "Sanctioned UI wrappers" for usage rules.
 */
export const Button = Object.assign(
  memo(function Button({ className, ...rest }: ButtonProps) {
    return (
      <HeroButton
        {...rest}
        className={cn('border-b-raise active:border-b-press active:translate-y-[3px]', className)}
      />
    )
  }),
  {
    Label: HeroButton.Label,
  },
)
