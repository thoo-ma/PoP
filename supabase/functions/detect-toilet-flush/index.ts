import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getUserIdFromToken, corsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Edge Function Request Started ===')
    
    // Get Cloud Run configuration from environment
    const CLOUD_RUN_URL = Deno.env.get('CLOUD_RUN_URL')
    const CLOUD_RUN_API_KEY = Deno.env.get('CLOUD_RUN_API_KEY')

    if (!CLOUD_RUN_URL || !CLOUD_RUN_API_KEY) {
      throw new Error('Missing Cloud Run configuration')
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Try to get user from JWT (optional for dev mode)
    const authHeader = req.headers.get('Authorization')
    let userId = 'anonymous'

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const resolvedId = await getUserIdFromToken(supabaseClient, token, 'detect-toilet-flush')
      if (resolvedId) userId = resolvedId
    } else {
      console.warn('No Authorization header - proceeding in dev mode')
    }

    // Get request body
    const { audio_base64, threshold = 0.5 } = await req.json()

    if (!audio_base64) {
      return respondError(400, 'Bad Request', 'Missing audio_base64 in request body')
    }

    // Check rate limit
    const cfg = await getGameConfig(supabaseClient)
    const detectionsPerDay = cfg.cloud_run.DETECTIONS_PER_DAY

    // Count user's detections in the last 24 hours
    const { count, error: countError } = await supabaseClient
      .from('flush_detections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (countError) {
      console.error('Error checking rate limit:', countError)
    }

    if (count !== null && count >= detectionsPerDay) {
      return respondError(429, 'Rate limit exceeded',
        `You have reached the daily limit of ${detectionsPerDay} detections. Please try again tomorrow.`,
        { limit: detectionsPerDay, current_count: count },
      )
    }

    // Calculate audio size
    const audioSizeKb = Math.round((audio_base64.length * 3) / 4 / 1024)

    // Forward to Cloud Run
    console.log('Calling Cloud Run:', CLOUD_RUN_URL)
    console.log('Audio size:', audioSizeKb, 'KB')
    
    const cloudRunResponse = await fetch(`${CLOUD_RUN_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLOUD_RUN_API_KEY,
      },
      body: JSON.stringify({
        audio: audio_base64,
        threshold: threshold
      })
    })

    console.log('Cloud Run response status:', cloudRunResponse.status)
    
    if (!cloudRunResponse.ok) {
      const errorText = await cloudRunResponse.text()
      console.error('Cloud Run error response:', errorText)
      throw new Error(`Cloud Run error: ${cloudRunResponse.status} - ${errorText}`)
    }

    const result = await cloudRunResponse.json()

    // Check if detection had an error (Cloud Run returned 200 but with an error
    // body, e.g. "Audio too short"). This is a client input problem, so 422 is
    // the correct status — not 500, which implies a server fault.
    if (result.error) {
      return respondError(422, 'Detection failed', result.error)
    }

    // Store detection result in database
    const { error: insertError } = await supabaseClient
      .from('flush_detections')
      .insert({
        user_id: userId,
        detected: result.detected,
        confidence: result.confidence,
        duration_seconds: result.duration_seconds,
        model_version: result.model_version,
        audio_size_kb: audioSizeKb
      })

    if (insertError) {
      console.error('Error inserting detection:', insertError)
      // Don't fail the request if DB insert fails, just log it
    }

    // Return detection result
    return respondOk({
      detected: result.detected,
      confidence: result.confidence,
      duration_seconds: result.duration_seconds,
      top_predictions: result.top_predictions,
      model_version: result.model_version,
      threshold_used: result.threshold_used,
    })

  } catch (error) {
    console.error('Edge Function error:', error)
    return respondError(500, 'Internal server error', error.message)
  }
})
