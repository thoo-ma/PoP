import { Image as ExpoImage } from 'expo-image'
import type { ImageErrorEventData } from 'expo-image'
import type { ComponentProps } from 'react'
import { useState } from 'react'
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
 * On load error falls back to the placeholder background (source is set to null).
 * Override any prop at the callsite as needed.
 */
export function RemoteImage({
  source,
  style,
  onError,
  ...props
}: ComponentProps<typeof StyledImage>) {
  const [hasError, setHasError] = useState(false)

  function handleError(event: ImageErrorEventData) {
    setHasError(true)
    onError?.(event)
  }

  return (
    <StyledImage
      source={hasError ? null : source}
      cachePolicy="memory-disk"
      transition={IMAGE_TRANSITION_DURATION}
      style={[{ backgroundColor: IMAGE_PLACEHOLDER_BG }, style]}
      onError={handleError}
      {...props}
    />
  )
}
