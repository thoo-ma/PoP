import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { useDevMock } from '@/lib/devMock'
import { supabase } from '@/lib/supabase'
import type { NFT } from '@/types/nft'
import { logError } from '@/utils/errorHelpers'

async function fetchUserNFTs(): Promise<NFT[]> {
  // getSession() reads from local storage — fast and reliable on remount.
  // getUser() does a network trip and can return null during token refresh.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return []

  const { data: nftsData, error: nftsError } = await supabase
    .from('nfts')
    .select('*, marketplace_listings(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (nftsError) {
    logError('useUserNFTs:Fetch', nftsError)
    throw new Error(nftsError.message)
  }

  return (nftsData ?? []).map(({ user_id: _, marketplace_listings, ...nft }) => ({
    ...nft,
    isListed: !!marketplace_listings,
    price: marketplace_listings?.price,
  }))
}

/**
 * Hook to fetch and manage user's NFT collection.
 * Fetches NFTs from Supabase including marketplace listing status.
 * Uses React Query for automatic cache deduplication and invalidation.
 *
 * @returns The user's NFT collection (`nfts`), async state (`loading`, `error`),
 *   and a `refetch` callback.
 */
export function useUserNFTs() {
  const mock = useDevMock()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.userNFTs,
    queryFn: fetchUserNFTs,
    enabled: !mock?.userNFTs,
  })

  if (mock?.userNFTs) return mock.userNFTs
  return {
    nfts: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  }
}
