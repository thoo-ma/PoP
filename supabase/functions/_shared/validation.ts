import { z } from 'zod'
import { respondError } from './responses.ts'

export { z }

const DEFAULT_MAX_BODY_BYTES = 64 * 1024 // 64 KB

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${Math.round(bytes / (1024 * 1024))}MB`
    : `${Math.round(bytes / 1024)}KB`
}

/**
 * Parses and validates a request body against a Zod schema.
 * Rejects with HTTP 413 if the body exceeds `maxBytes` (default 64 KB).
 * Returns the parsed data or an error Response.
 */
export async function parseBody<S extends z.ZodTypeAny>(
  req: Request,
  schema: S,
  maxBytes = DEFAULT_MAX_BODY_BYTES,
): Promise<z.infer<S> | Response> {
  // Fast-path: reject based on Content-Length header before reading the body
  const contentLength = req.headers.get('content-length')
  if (contentLength !== null && parseInt(contentLength, 10) > maxBytes) {
    return respondError(413, 'payload_too_large', `Request body must not exceed ${formatBytes(maxBytes)}`)
  }

  let raw: unknown
  try {
    const text = await req.text()
    const byteLength = new TextEncoder().encode(text).byteLength
    if (byteLength > maxBytes) {
      return respondError(413, 'payload_too_large', `Request body must not exceed ${formatBytes(maxBytes)}`)
    }
    raw = JSON.parse(text)
  } catch {
    return respondError(400, 'bad_request', 'Request body must be valid JSON')
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const first = result.error.errors[0]
    const field = first.path.length > 0 ? first.path.join('.') : 'body'
    const message = `${field}: ${first.message}`
    return respondError(400, 'bad_request', message, {
      validation_errors: result.error.errors.map((e) => ({
        field: e.path.join('.') || 'body',
        message: e.message,
      })),
    })
  }
  return result.data
}
