/**
 * Cloud Run audio detection constants — single source of truth for
 * dashboard and Supabase Edge Functions.
 *
 * These values are forwarded per-request from the `detect-toilet-flush`
 * edge function to Google Cloud Run. Cloud Run itself uses them as
 * request-body overrides over its Python-level defaults.
 *
 * Supabase imports via:   ../../../shared/cloudRun.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

/** YAMNet class index for "Toilet flush" sound. */
export const YAMNET_TOILET_FLUSH_CLASS = 368;

/** Maximum audio duration in seconds before truncation. */
export const MAX_AUDIO_DURATION = 30.0;

/** Minimum audio duration in seconds (below this, detection returns an error). */
export const MIN_AUDIO_DURATION = 0.5;
