import type { ButtonRootProps } from 'heroui-native'
import { Button, cn } from 'heroui-native'
import { tactileButton, tactileButtonText } from '@/styles/shared/buttons'

type TactileVariant = 'default' | 'primary' | 'outline' | 'secondary' | 'disabled'
type TactileSize = 'default' | 'sm'

// Extract the 'none' feedback variant branch of Button's discriminated union props,
// then replace HeroUI's variant/size/feedbackVariant with tactile-recipe equivalents.
type ButtonPropsNone = Extract<ButtonRootProps, { feedbackVariant: 'none' }>
export type TactileButtonProps = Omit<ButtonPropsNone, 'variant' | 'size' | 'feedbackVariant'> & {
  variant?: TactileVariant
  size?: TactileSize
}

/**
 * Wrapper around HeroUI Button that internalises the tactile-button styling recipe.
 *
 * - Always applies `variant="ghost"` and `feedbackVariant="none"` on the underlying Button.
 * - Applies `tactileButton({ variant, size })` to the Button's className.
 * - String children are auto-wrapped in `<Button.Label>` with `tactileButtonText({ variant, size })`.
 * - Non-string children (Spinner, icon + Fragment, etc.) are passed through untouched so
 *   callers can manage their own label markup.
 */
export default function TactileButton({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: TactileButtonProps) {
  return (
    <Button
      {...props}
      variant="ghost"
      feedbackVariant="none"
      className={cn(tactileButton({ variant, size }), className)}
    >
      {typeof children === 'string' ? (
        <Button.Label className={tactileButtonText({ variant, size })}>{children}</Button.Label>
      ) : (
        children
      )}
    </Button>
  )
}
