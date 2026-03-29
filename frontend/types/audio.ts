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

/**
 * Return type for useToiletDetection hook
 */
export interface UseToiletDetectionReturn {
  isRecording: boolean
  audioUri: string | null
  detectionResult: DetectionResult | null
  isAnalyzing: boolean
  error: string | null
  rateLimitError: RateLimitError | null
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
  analyzeAudio: (threshold?: number) => Promise<void>
  clearResult: () => void
}
