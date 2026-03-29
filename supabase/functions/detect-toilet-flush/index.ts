import { serve } from "std/http/server"
import { requireAuth, getCorsHeaders } from '../_shared/auth.ts'
import { getGameConfig } from '../_shared/gameConfig.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const DetectSchema = z.object({
  audio_base64: z.string().min(1, 'audio_base64 cannot be empty'),
  threshold: z.number().min(0).max(1).optional().default(0.5),
})

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req.headers.get('origin')) })
  }

  const origin = req.headers.get('origin')

  try {
    // Get Cloud Run configuration from environment
    const CLOUD_RUN_URL = Deno.env.get('CLOUD_RUN_URL')
    const CLOUD_RUN_API_KEY = Deno.env.get('CLOUD_RUN_API_KEY')

    if (!CLOUD_RUN_URL || !CLOUD_RUN_API_KEY) {
      throw new Error('Missing Cloud Run configuration')
    }

    const auth = await requireAuth(req, 'detect-toilet-flush')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth
    console.log('detect-toilet-flush: user', userId)

    // Get request body
    const bodyResult = await parseBody(req, DetectSchema, 10 * 1024 * 1024) // 10 MB — audio_base64 payload
    if (bodyResult instanceof Response) return bodyResult
    const { audio_base64, threshold } = bodyResult

    // Check rate limit
    const cfg = await getGameConfig(supabase)
    const detectionsPerDay = cfg.cloud_run.DETECTIONS_PER_DAY

    // Count user's detections in the last 24 hours
    const { count, error: countError } = await supabase
      .from('flush_detections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (countError) {
      console.error('detect-toilet-flush: rate limit check error', countError)
    }

    if (count !== null && count >= detectionsPerDay) {
      return respondError(429, 'rate_limit_exceeded',
        `You have reached the daily limit of ${detectionsPerDay} detections. Please try again tomorrow.`,
        { limit: detectionsPerDay, current_count: count }, origin,
      )
    }

    // Calculate audio size
    const audioSizeKb = Math.round((audio_base64.length * 3) / 4 / 1024)

    // Forward to Cloud Run
    console.log('detect-toilet-flush: calling Cloud Run', CLOUD_RUN_URL)
    console.log('detect-toilet-flush: audio size', audioSizeKb, 'KB')
    
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

    console.log('detect-toilet-flush: Cloud Run response status', cloudRunResponse.status)

    if (!cloudRunResponse.ok) {
      const errorText = await cloudRunResponse.text()
      console.error('detect-toilet-flush: Cloud Run error response', errorText)
      throw new Error(`Cloud Run error: ${cloudRunResponse.status} - ${errorText}`)
    }

    const result = await cloudRunResponse.json()

    // Check if detection had an error (Cloud Run returned 200 but with an error
    // body, e.g. "Audio too short"). This is a client input problem, so 422 is
    // the correct status — not 500, which implies a server fault.
    if (result.error) {
      return respondError(422, 'detection_failed', result.error, undefined, origin)
    }

    // Store detection result in database
    const { error: insertError } = await supabase
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
      console.error('detect-toilet-flush: insert detection error', insertError)
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
    }, origin)

  } catch (error) {
    console.error('detect-toilet-flush: error', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return respondError(500, 'internal_error', message, undefined, origin)
  }
})
