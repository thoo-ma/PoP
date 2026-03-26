import { jsonHeaders } from './headers.ts'

/** Return a 200 JSON response with CORS headers. */
export function respondOk(data: unknown): Response {
  return new Response(JSON.stringify(data), { status: 200, headers: jsonHeaders })
}

/** Return a JSON error response with CORS headers.
 *
 * Shape: `{ error, message, details? }` — extra fields are always nested
 * under `details` so clients can parse errors with a single type.
 */
export function respondError(
  status: number,
  error: string,
  message: string,
  details?: Record<string, unknown>,
): Response {
  return new Response(
    JSON.stringify(details ? { error, message, details } : { error, message }),
    { status, headers: jsonHeaders },
  )
}
