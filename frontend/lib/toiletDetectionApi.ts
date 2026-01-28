import { supabase } from './supabase';
import type { DetectionResult, RateLimitError } from '../types/audio';

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
    console.log('Calling edge function with audio length:', audioBase64.length);
    
    const { data, error } = await supabase.functions.invoke('detect-toilet-flush', {
      body: {
        audio_base64: audioBase64,
        threshold: threshold
      }
    });

    console.log('Edge function response:', { data, error });

    if (error) {
      console.error('Edge function error:', error);
      
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
    console.error('Detection API error:', error);
    
    // Re-throw if it's already a structured error
    if (error && typeof error === 'object' && 'error' in error) {
      throw error;
    }
    // Otherwise wrap in generic error
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

/**
 * Fetch user's detection history
 * @param limit - Maximum number of records to fetch
 * @returns Array of detection records
 */
export async function fetchDetectionHistory(limit: number = 50) {
  const { data, error } = await supabase
    .from('flush_detections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
