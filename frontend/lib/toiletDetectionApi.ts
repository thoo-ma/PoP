import { FunctionsHttpError } from '@supabase/supabase-js'
import type { DetectionResult, RateLimitError } from '@/types'
import { getErrorMessage, isRateLimitError } from '@/utils/errorHelpers'
import { supabase } from './supabase'

/**
 * Call Supabase Edge Function to detect toilet flush
 * @param audioBase64 - Base64 encoded audio data
 * @param threshold - Detection threshold (0.0-1.0)
 * @returns Detection result or throws error
 */
export async function detectToiletFlush(
  audioBase64: string,
  threshold: number = 0.5,
): Promise<DetectionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('detect-toilet-flush', {
      body: {
        audio_base64: audioBase64,
        threshold: threshold,
      },
    })

    if (error) {
      // Parse the structured response body from respondError().
      let body: Record<string, unknown> | null = null
      let httpStatus: number | null = null
      if (error instanceof FunctionsHttpError) {
        httpStatus = error.context.status
        try {
          body = await error.context.json()
        } catch {
          /* leave null */
        }
      }

      // Rate-limit error (429) — build a typed RateLimitError from the body.
      if (httpStatus === 429) {
        const rateLimitError: RateLimitError = {
          error: 'rate_limit',
          message: (body?.message as string) ?? (body?.error as string) ?? 'Rate limit exceeded',
          limit: (body?.limit as number) ?? 0,
          current_count: (body?.current_count as number) ?? 0,
        }
        throw rateLimitError
      }

      // Any other edge-function error — prefer the human-readable `message`.
      const detail =
        (body?.message as string) ?? (body?.error as string) ?? error.message ?? 'Unknown error'
      throw new Error(`Detection failed: ${detail}`)
    }

    if (!data) {
      throw new Error('No data returned from edge function')
    }

    return data as DetectionResult
  } catch (error) {
    // Re-throw if it's a structured error (like rate limit)
    if (isRateLimitError(error)) {
      throw error
    }
    // Otherwise wrap in generic error
    throw new Error(getErrorMessage(error, 'Unknown error occurred'))
  }
}
