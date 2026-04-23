import { type AvatarRootProps, Avatar as HeroAvatar } from 'heroui-native'
import { memo } from 'react'

export type AvatarProps = AvatarRootProps

/**
 * Brand-wrapped `Avatar`. Pins `color="accent"` as the explicit brand default
 * so consumers don't reach back into HeroUI's color palette. Compound parts
 * (`Image`, `Fallback`) pass through unchanged. See
 * `frontend/.instructions.md` § "Sanctioned UI wrappers" for usage rules.
 */
export const Avatar = Object.assign(
  memo(function Avatar({ color = 'accent', ...rest }: AvatarProps) {
    return <HeroAvatar color={color} {...rest} />
  }),
  {
    Image: HeroAvatar.Image,
    Fallback: HeroAvatar.Fallback,
  },
)
