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
// @migration: UNCERTAIN — in DB schema but coupled to the ML model binary; changing this without redeploying Cloud Run is a breaking change
export const YAMNET_TOILET_FLUSH_CLASS = 368;

/** Maximum audio duration in seconds before truncation. */
// @migration: UNCERTAIN — in DB schema; decide whether this is an admin-tunable limit or a model-coupled constraint before removing
export const MAX_AUDIO_DURATION = 30.0;

/** Minimum audio duration in seconds (below this, detection returns an error). */
// @migration: UNCERTAIN — in DB schema; decide whether this is an admin-tunable limit or a model-coupled constraint before removing
export const MIN_AUDIO_DURATION = 0.5;

/** Maximum number of flush detections a user may submit per 24-hour window. */
// @migration: DELETE — game_config.cloud_run
export const DETECTIONS_PER_DAY = 10;
