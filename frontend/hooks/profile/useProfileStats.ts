import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

interface ProfileStats {
  detections: number
  daysActive: number
}

async function fetchProfileStats(): Promise<ProfileStats> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return { detections: 0, daysActive: 0 }

  const userId = session.user.id

  // Fetch detection count and user creation date in parallel
  const [detectionsResult, userResult] = await Promise.all([
    supabase
      .from('flush_detections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('detected', true),
    supabase.from('users').select('created_at').eq('id', userId).single(),
  ])

  if (detectionsResult.error) {
    logError('useProfileStats:detections', detectionsResult.error)
    throw new Error(detectionsResult.error.message)
  }

  if (userResult.error) {
    logError('useProfileStats:user', userResult.error)
    throw new Error(userResult.error.message)
  }

  const detections = detectionsResult.count ?? 0
  const daysActive = userResult.data?.created_at
    ? Math.floor((Date.now() - new Date(userResult.data.created_at).getTime()) / 86_400_000)
    : 0

  return { detections, daysActive }
}

/**
 * Hook to fetch profile statistics: detection count and days active.
 * NFT count is derived from `useUserNFTs` (shared React Query cache).
 */
export function useProfileStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.profileStats,
    queryFn: fetchProfileStats,
  })

  return {
    detections: data?.detections ?? 0,
    daysActive: data?.daysActive ?? 0,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  }
}
