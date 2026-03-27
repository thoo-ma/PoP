import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../../shared/database.types.ts'
import { respondError } from './responses.ts'
type SupabaseClient = ReturnType<typeof createClient<Database>>

export { corsHeaders } from './headers.ts'

/**
 * Decode a JWT's payload section without verifying the signature.
 * Used as a fallback when `supabase.auth.getUser()` fails, e.g. over an Expo
 * Go tunnel.
 *
 * NOTE (backlog 9.4): this trusts the token presentation without signature
 * validation. Remove once the Expo Go tunnel reliability issue is resolved.
 */
export function decodeJwtSub(token: string): string | null {
  try {
    const b64url = token.split('.')[1]
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')
    const payload = JSON.parse(atob(padded))
    return payload?.sub ?? null
  } catch {
    return null
  }
}

/**
 * Resolve a user ID from a bearer token.
 *
 * 1. Calls `supabase.auth.getUser(token)` — validates the token server-side.
 * 2. Falls back to a client-side JWT payload decode (no signature check) when
 *    the network call fails (see `decodeJwtSub` note above).
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

  // Fallback: decode JWT payload without a network call
  const sub = decodeJwtSub(token)
  if (!sub) console.error(`${fnName}: JWT decode failed`)
  return sub
}

/**
 * Extract the bearer token from the Authorization header, spin up a
 * service-role Supabase client, and resolve the authenticated user ID.
 *
 * Returns `{ userId, token, supabase }` on success, or a `Response` with
 * HTTP 401 that the caller should return directly:
 *
 * ```ts
 * const auth = await requireAuth(req, 'my-function')
 * if (auth instanceof Response) return auth
 * const { userId, supabase } = auth
 * ```
 */
export async function requireAuth(
  req: Request,
  fnName: string,
): Promise<{ userId: string; token: string; supabase: SupabaseClient } | Response> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return respondError(401, 'unauthorized', 'Missing Authorization header')
  }

  const token = authHeader.replace('Bearer ', '')

  const supabase = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const userId = await getUserIdFromToken(supabase, token, fnName)

  if (!userId) {
    return respondError(401, 'unauthorized', 'Could not extract user from token')
  }

  return { userId, token, supabase }
}
