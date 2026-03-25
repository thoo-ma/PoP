import { z } from 'zod'
import { respondError } from './responses.ts'

export { z }

/**
 * Parses and validates a request body against a Zod schema.
 * Returns the parsed data or a 400 Response with a descriptive error message.
 */
export async function parseBody<T>(
  req: Request,
  schema: z.ZodType<T>,
): Promise<T | Response> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return respondError(400, 'Bad Request', 'Request body must be valid JSON')
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const first = result.error.errors[0]
    const field = first.path.length > 0 ? first.path.join('.') : 'body'
    const message = `${field}: ${first.message}`
    return respondError(400, 'Bad Request', message, {
      validation_errors: result.error.errors.map((e) => ({
        field: e.path.join('.') || 'body',
        message: e.message,
      })),
    })
  }
  return result.data
}
