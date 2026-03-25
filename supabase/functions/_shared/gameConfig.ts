/**
 * getGameConfig — live game balance config helper for Edge Functions.
 *
 * Reads every row from the `game_config` table (up to 10 rows, one per
 * mechanic key), validates each JSONB blob with its Zod schema, and
 * deep-merges valid overrides over the hard-coded shared/ defaults.
 *
 * Any missing or invalid row falls back silently to its defaults so the
 * game always runs, even when the table is empty or has bad data.
 *
 * Usage:
 *   const cfg = await getGameConfig(supabase)
 *   calcPoopEarned(type, rarity, level, cfg.currency)
 *   applyXP(xp, level, xpGained, cfg.xp)
 */

import { buildGameConfig, type FullGameConfig } from '../../../shared/gameConfig.ts'
import { createClient } from '@supabase/supabase-js'

export type { FullGameConfig }

// deno-lint-ignore no-explicit-any
type SupabaseClient = ReturnType<typeof createClient<any>>

/**
 * Fetch and merge game config from the DB.
 * Always returns a complete FullGameConfig — worst case everything is defaults.
 */
export async function getGameConfig(supabase: SupabaseClient): Promise<FullGameConfig> {
  try {
    const { data: rows, error } = await supabase
      .from('game_config')
      .select('key, value')

    if (error) {
      console.warn('getGameConfig: DB fetch failed, using defaults', error.message)
      return buildGameConfig().config
    }

    const { config, warnings } = buildGameConfig(rows ?? [])
    for (const w of warnings) console.warn(`getGameConfig: ${w}`)
    return config
  } catch (e) {
    console.warn('getGameConfig: unexpected error, using defaults', e)
    return buildGameConfig().config
  }
}
