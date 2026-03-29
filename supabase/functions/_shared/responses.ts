import { getJsonHeaders } from './headers.ts'

/** Return a 200 JSON response with CORS headers. */
export function respondOk(data: unknown, origin: string | null = null): Response {
  return new Response(JSON.stringify(data), { status: 200, headers: getJsonHeaders(origin) })
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
  origin: string | null = null,
): Response {
  return new Response(
    JSON.stringify(details ? { error, message, details } : { error, message }),
    { status, headers: getJsonHeaders(origin) },
  )
}
