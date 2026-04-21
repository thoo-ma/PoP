import { Image as ExpoImage } from 'expo-image'
import type { ComponentProps } from 'react'
import { withUniwind } from 'uniwind'
import { IMAGE_PLACEHOLDER_BG, IMAGE_TRANSITION_DURATION } from '@/constants'

const StyledImage = withUniwind(ExpoImage)

/**
 * expo-image wrapped with withUniwind so it accepts `className` via Uniwind.
 * Use for static bundled assets (require()). For remote URIs use RemoteImage.
 */
export const Image = StyledImage

/**
 * Pre-configured Image for remote URIs.
 * Bakes in memory-disk caching, fade-in transition, and placeholder background.
 * Override any prop at the callsite as needed.
 */
export function RemoteImage({ style, ...props }: ComponentProps<typeof StyledImage>) {
  return (
    <StyledImage
      cachePolicy="memory-disk"
      transition={IMAGE_TRANSITION_DURATION}
      style={[{ backgroundColor: IMAGE_PLACEHOLDER_BG }, style]}
      {...props}
    />
  )
}
