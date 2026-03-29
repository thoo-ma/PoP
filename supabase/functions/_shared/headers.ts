const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

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

// Static fallback used by response helpers (first-allowed-origin).
export const corsHeaders = getCorsHeaders(null)
export const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }
