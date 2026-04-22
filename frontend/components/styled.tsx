import type { ImageErrorEventData } from 'expo-image'
import { Image as ExpoImage } from 'expo-image'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { withUniwind } from 'uniwind'

/**
 * Background color shown while a remote image is loading.
 * Must stay in sync with --color-image-placeholder in global.css.
 * Inline style prop only — CSS variables cannot be used directly in RN style objects.
 */
const IMAGE_PLACEHOLDER_BG = '#2c2c2c'

/** Fade-in transition duration (ms) applied when a remote image finishes loading. */
const IMAGE_TRANSITION_DURATION = 200

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
 *
 * If `blurhash` is provided, expo-image renders it as the placeholder while
 * the full image loads (and the solid background colour is omitted so it
 * doesn't cover the blur). When `blurhash` is omitted the component keeps the
 * legacy solid `IMAGE_PLACEHOLDER_BG` behaviour.
 *
 * Override any prop at the callsite as needed.
 */
export function RemoteImage({
  source,
  style,
  onError,
  blurhash,
  placeholder,
  ...props
}: ComponentProps<typeof StyledImage> & { blurhash?: string | null }) {
  const [hasError, setHasError] = useState(false)

  function handleError(event: ImageErrorEventData) {
    setHasError(true)
    onError?.(event)
  }

  // Callsite-provided `placeholder` always wins; otherwise derive from blurhash.
  const resolvedPlaceholder = placeholder ?? (blurhash ? { blurhash } : undefined)
  // When a blurhash is shown, skip the solid bg so it doesn't cover the blur.
  const resolvedStyle = resolvedPlaceholder
    ? style
    : [{ backgroundColor: IMAGE_PLACEHOLDER_BG }, style]

  return (
    <StyledImage
      source={hasError ? null : source}
      cachePolicy="memory-disk"
      transition={IMAGE_TRANSITION_DURATION}
      placeholder={resolvedPlaceholder}
      style={resolvedStyle}
      onError={handleError}
      {...props}
    />
  )
}
