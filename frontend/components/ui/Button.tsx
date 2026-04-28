import { type ButtonRootProps, Button as HeroButton } from 'heroui-native'
import { memo } from 'react'

import { cn } from '@/lib/tv'

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
        className={cn(
          'border-2 border-border border-b-raise active:translate-y-0.75 active:border-b-press',
          className,
        )}
      />
    )
  }),
  {
    Label: HeroButton.Label,
  },
)
