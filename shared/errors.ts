/**
 * Canonical error codes returned by all edge functions.
 *
 * Base response shape:
 *   { error: EdgeFunctionErrorCode, message: string, details?: Record<string, unknown> }
 *
 * Extra fields (e.g. poop_balance, cooldown_ends_at) are always nested under `details`.
 */
export const EdgeFunctionErrorCode = {
  // 400
  BAD_REQUEST:          'bad_request',
  // 401
  UNAUTHORIZED:         'unauthorized',
  // 402
  INSUFFICIENT_POOP:    'insufficient_poop',
  // 404
  NOT_FOUND:            'not_found',
  // 409
  CONFLICT:             'conflict',
  // 422
  NO_ENERGY:            'no_energy',
  BREED_LIMIT_REACHED:  'breed_limit_reached',
  INCOMPATIBLE_RARITIES:'incompatible_rarities',
  INSUFFICIENT_POINTS:  'insufficient_points',
  STAT_CAP_EXCEEDED:    'stat_cap_exceeded',
  MAX_HOLDS_REACHED:    'max_holds_reached',
  DETECTION_FAILED:     'detection_failed',
  // 429
  ON_COOLDOWN:          'on_cooldown',
  RATE_LIMIT_EXCEEDED:  'rate_limit_exceeded',
  // 500
  INTERNAL_ERROR:       'internal_error',
} as const

export type EdgeFunctionErrorCode = typeof EdgeFunctionErrorCode[keyof typeof EdgeFunctionErrorCode]

/** Base error response shape shared by all edge functions. */
export interface EdgeFunctionErrorResponse {
  error: EdgeFunctionErrorCode
  message: string
  details?: Record<string, unknown>
}

// ── Per-error detail shapes ──────────────────────────────────────────────────

export interface InsufficientPoopDetails {
  poop_balance: number
  poop_required: number
  /** Optional breakdown of costs by item (e.g. for breeding) */
  poop_required_breakdown?: Record<string, number>
}

export interface CooldownDetails {
  cooldown_ends_at: string
  cooldown_remaining_seconds: number
}
