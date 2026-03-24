import { corsHeaders } from './auth.ts'

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }

/** Return a 200 JSON response with CORS headers. */
export function respondOk(data: unknown): Response {
  return new Response(JSON.stringify(data), { status: 200, headers: jsonHeaders })
}

/** Return a JSON error response with CORS headers. */
export function respondError(
  status: number,
  error: string,
  message: string,
  details?: Record<string, unknown>,
): Response {
  return new Response(
    JSON.stringify({ error, message, ...details }),
    { status, headers: jsonHeaders },
  )
}
