import { requireAuth, getCorsHeaders, type SupabaseClient } from './auth.ts'

export { getCorsHeaders }
export type { SupabaseClient }

export type InitResult = {
  origin: string | null
  userId: string
  supabase: SupabaseClient
}

/**
 * Common entry-point for every edge function handler.
 *
 * 1. Handles CORS preflight (`OPTIONS` → 200 with CORS headers).
 * 2. Extracts the request origin.
 * 3. Authenticates the caller via `requireAuth()`.
 *
 * Returns `{ origin, userId, supabase }` on success, or a `Response`
 * the caller should return directly:
 *
 * ```ts
 * const init = await initHandler(req, 'my-function')
 * if (init instanceof Response) return init
 * const { origin, userId, supabase } = init
 * ```
 */
export async function initHandler(
  req: Request,
  fnName: string,
): Promise<InitResult | Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req.headers.get('origin')) })
  }

  const origin = req.headers.get('origin')

  const auth = await requireAuth(req, fnName, origin)
  if (auth instanceof Response) return auth
  const { userId, supabase } = auth

  return { origin, userId, supabase }
}
