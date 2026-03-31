import { serve } from "std/http/server"
import { requireAuth, getCorsHeaders } from '../_shared/auth.ts'
import { respondOk, respondError } from '../_shared/responses.ts'

serve(async (req) => {
  const origin = req.headers.get('origin')

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(origin) })
  }

  try {
    const auth = await requireAuth(req, 'seed-dev-test-nfts')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    console.log('seed-dev-test-nfts: user', userId)

    // Call the RPC via service_role, passing the verified user ID
    // (anon/authenticated have been revoked; auth.uid() is null under service_role)
    const { data, error } = await supabase.rpc('seed_dev_test_nfts', { p_user_id: userId })

    if (error) {
      console.error('seed-dev-test-nfts: RPC error', error)
      return respondError(500, 'seed_failed', 'Failed to seed dev test data', undefined, origin)
    }

    console.log('seed-dev-test-nfts: seeded successfully', data)
    return respondOk(data, origin)
  } catch (err) {
    console.error('seed-dev-test-nfts: unexpected error', err)
    return respondError(500, 'internal_error', 'Unexpected server error', undefined, origin)
  }
})
