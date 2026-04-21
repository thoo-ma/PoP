import { Image as ExpoImage } from 'expo-image'
import { withUniwind } from 'uniwind'

/**
 * expo-image wrapped with withUniwind so it accepts `className` via Uniwind.
 * Import from here instead of 'expo-image' or 'react-native'.
 */
export const Image = withUniwind(ExpoImage)
