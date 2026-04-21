import { useCallback } from 'react'
import { AccessibilityInfo } from 'react-native'

/**
 * Returns a stable `announce` callback that posts an accessibility
 * announcement to the platform screen reader (VoiceOver on iOS,
 * TalkBack on Android) via `AccessibilityInfo.announceForAccessibility`.
 *
 * Usage:
 * ```ts
 * const announce = useAnnounce()
 * announce('Recording started, detecting flush')
 * ```
 */
export function useAnnounce(): (message: string) => void {
  return useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message)
  }, [])
}
