import type { RateLimitError } from '@/types'

/**
 * Extract a user-friendly error message from any error type
 * @param error - The error to extract a message from
 * @param fallback - Fallback message if error can't be parsed
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return fallback
}

/**
 * Log error to console (and future monitoring services)
 * @param context - Context where the error occurred (e.g., 'Auth', 'ToiletDetection')
 * @param error - The error to log
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error)
  // Future: Send to Sentry/Bugsnag
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { tags: { context } });
  // }
}

/**
 * Type guard to check if an error is a rate limit error
 * @param error - The error to check
 * @returns True if error is a RateLimitError
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    error !== null && typeof error === 'object' && 'error' in error && error.error === 'rate_limit'
  )
}
