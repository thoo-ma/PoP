import { supabase } from './supabase';
import type { DetectionResult, RateLimitError } from '@/types/audio';
import { getErrorMessage, logError, isRateLimitError } from '@/utils/errorHelpers';

/**
 * Call Supabase Edge Function to detect toilet flush
 * @param audioBase64 - Base64 encoded audio data
 * @param threshold - Detection threshold (0.0-1.0)
 * @returns Detection result or throws error
 */
export async function detectToiletFlush(
  audioBase64: string,
  threshold: number = 0.5
): Promise<DetectionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('detect-toilet-flush', {
      body: {
        audio_base64: audioBase64,
        threshold: threshold
      }
    });

    if (error) {
      // Check if it's a rate limit error (429)
      if (error.message && error.message.includes('Rate limit')) {
        const rateLimitError: RateLimitError = {
          error: 'rate_limit',
          message: error.message,
          limit: 10,
          current_count: 10
        };
        throw rateLimitError;
      }
      
      // Provide more context in error message
      const errorDetails = [
        error.message || 'Unknown error',
        error.status ? `Status: ${error.status}` : null,
        error.context ? JSON.stringify(error.context) : null
      ].filter(Boolean).join(' | ');
      
      throw new Error(`Detection failed: ${errorDetails}`);
    }

    if (!data) {
      throw new Error('No data returned from edge function');
    }

    return data as DetectionResult;
  } catch (error) {
    logError('ToiletDetectionAPI', error);
    
    // Re-throw if it's a structured error (like rate limit)
    if (isRateLimitError(error)) {
      throw error;
    }
    // Otherwise wrap in generic error
    throw new Error(getErrorMessage(error, 'Unknown error occurred'));
  }
}
