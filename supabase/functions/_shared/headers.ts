const _parsed = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// Fall back to localhost when the env var is absent or empty (dev only).
const ALLOWED_ORIGINS: string[] = _parsed.length > 0 ? _parsed : ['http://localhost:3000']

/**
 * Build CORS headers for a given request origin.
 *
 * If `origin` is in the ALLOWED_ORIGINS allowlist, it is echoed back as the
 * Access-Control-Allow-Origin value. Otherwise the first entry in the list is
 * used (which will cause the browser to block mis-matched origins — the
 * intended behaviour).
 *
 * Set the ALLOWED_ORIGINS env var to a comma-separated list of permitted
 * client origins, e.g. "https://pop.example.com,https://preview.pop.example.com".
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  }
}

/**
 * Build JSON response headers (CORS + Content-Type) for a given request origin.
 *
 * Use this over the static `jsonHeaders` export so that non-OPTIONS responses
 * echo the actual request origin in Access-Control-Allow-Origin, matching the
 * behaviour of getCorsHeaders used for preflight.
 */
export function getJsonHeaders(origin: string | null): Record<string, string> {
  return { ...getCorsHeaders(origin), 'Content-Type': 'application/json' }
}

// Static fallbacks (first-allowed-origin) kept for legacy callers.
export const corsHeaders = getCorsHeaders(null)
export const jsonHeaders = getJsonHeaders(null)
