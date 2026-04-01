import type { SupabaseClient } from './auth.ts'
import type { Database } from '../../../shared/database.types.ts'
import { respondError } from './responses.ts'

type TablesWithUserId = {
  [K in keyof Database['public']['Tables']]: Database['public']['Tables'][K]['Row'] extends { user_id: string }
    ? K
    : never
}[keyof Database['public']['Tables']]

type TableName = TablesWithUserId

/**
 * Fetch a single row from `table` where `id` and `user_id` both match.
 *
 * Returns the row data on success, or a 404 `Response` the caller should
 * return directly:
 *
 * ```ts
 * const nft = await fetchOwned(supabase, 'nfts', nft_id, userId, 'id, energy, level, rarity', origin)
 * if (nft instanceof Response) return nft
 * ```
 */
export async function fetchOwned<T = Record<string, unknown>>(
  supabase: SupabaseClient,
  table: TableName,
  id: string,
  userId: string,
  select: string,
  origin: string | null,
): Promise<T | Response> {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    const label = table === 'nfts' ? 'NFT'
      : table === 'mystery_boxes' ? 'Mystery box'
      : table === 'pending_loot_rolls' ? 'Loot roll'
      : 'Record'
    return respondError(404, 'not_found', `${label} not found or not owned by you`, undefined, origin)
  }

  return data as T
}
