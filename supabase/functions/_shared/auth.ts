import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../../shared/database.types.ts'
import { respondError } from './responses.ts'
export type SupabaseClient = ReturnType<typeof createClient<Database>>

export { corsHeaders, getCorsHeaders, getJsonHeaders } from './headers.ts'

/**
 * Resolve a user ID from a bearer token by calling `supabase.auth.getUser(token)`.
 * Returns `null` (→ 401) if validation fails for any reason.
 */
export async function getUserIdFromToken(
  supabase: SupabaseClient,
  token: string,
  fnName: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error) console.error(`${fnName}: getUser error`, error)
    if (data?.user?.id) return data.user.id
  } catch (e) {
    console.error(`${fnName}: getUser exception`, e)
  }
  return null
}

/**
 * Extract the bearer token from the Authorization header, spin up a
 * service-role Supabase client, and resolve the authenticated user ID.
 *
 * Returns `{ userId, token, supabase }` on success, or a `Response` with
 * HTTP 401 that the caller should return directly:
 *
 * ```ts
 * const auth = await requireAuth(req, 'my-function', origin)
 * if (auth instanceof Response) return auth
 * const { userId, supabase } = auth
 * ```
 */
export async function requireAuth(
  req: Request,
  fnName: string,
  origin: string | null = null,
): Promise<{ userId: string; token: string; supabase: SupabaseClient } | Response> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return respondError(401, 'unauthorized', 'Missing Authorization header', undefined, origin)
  }

  const token = authHeader.replace('Bearer ', '')

  const supabase = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const userId = await getUserIdFromToken(supabase, token, fnName)

  if (!userId) {
    return respondError(401, 'unauthorized', 'Could not extract user from token', undefined, origin)
  }

  return { userId, token, supabase }
}
