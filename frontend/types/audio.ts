/**
 * Audio detection types
 */

/**
 * Result from toilet flush detection
 */
export interface DetectionResult {
  detected: boolean
  confidence: number
  duration_seconds: number
  top_predictions?: Array<{
    class: string
    confidence: number
  }>
  model_version?: string
  threshold_used?: number
}

/**
 * Rate limit error response
 */
export interface RateLimitError {
  error: string
  message: string
  limit: number
  current_count: number
}
