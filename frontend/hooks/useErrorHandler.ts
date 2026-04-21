import { useCallback, useState } from 'react'
import { getErrorMessage, logError } from '@/utils/errorHelpers'

/**
 * Custom hook for handling errors consistently across components
 * Provides error state management with automatic logging
 *
 * @param context - Component/feature name for error logging (e.g., 'DetectionHistory', 'Auth')
 * @returns Object with error state and handler functions
 *
 * @example
 * const { error, handleError, clearError } = useErrorHandler('MyComponent');
 *
 * try {
 *   await someAsyncOperation();
 * } catch (err) {
 *   handleError(err, 'Failed to complete operation');
 * }
 */
export function useErrorHandler(context: string) {
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle an error by logging it and setting error state
   * @param err - The error to handle
   * @param customMessage - Optional custom fallback message
   */
  // kept: recreates whenever `context` changes (it's a plain string prop); used inside useEffect dep
  // arrays in useToiletDetection and screen handlers — without useCallback those effects would re-fire
  // on every render regardless of whether the error state actually changed.
  const handleError = useCallback(
    (err: unknown, customMessage?: string) => {
      logError(context, err)
      const message = customMessage || getErrorMessage(err)
      setError(message)
    },
    [context],
  )

  /**
   * Clear the current error state
   */
  // kept: consumed in the same useEffect dep arrays as handleError; without useCallback it recreates
  // on every render and those effects would re-fire unconditionally.
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}
