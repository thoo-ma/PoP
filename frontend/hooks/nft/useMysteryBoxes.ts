import type { MysteryBox } from '@pop/shared'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { supabase } from '@/lib/supabase'

async function fetchMysteryBoxes(): Promise<MysteryBox[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return []

  const { data, error } = await supabase
    .from('mystery_boxes')
    .select('id, rarity, image_url, opened, created_at')
    .eq('user_id', session.user.id)
    .eq('opened', false)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as MysteryBox[]
}

/**
 * Hook to fetch the current user's unopened mystery boxes via React Query.
 *
 * All consumers share a single cache entry (`queryKeys.mysteryBoxes`).
 * Mutation hooks (breed, open-box) invalidate this key after success.
 */
export function useMysteryBoxes() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.mysteryBoxes,
    queryFn: fetchMysteryBoxes,
  })

  return {
    boxes: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  }
}
