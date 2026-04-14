import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { supabase } from '@/lib/supabase'
import type { NFT } from '@/types'

async function fetchMarketplaceListings(): Promise<NFT[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('marketplace_listings')
    .select(`
      nft_id,
      price,
      listed_at,
      nfts:nft_id (
        id,
        name,
        image_url,
        type,
        rarity,
        efficiency,
        resilience,
        comfort,
        luck,
        energy,
        level,
        xp,
        stat_points,
        breed_count,
        last_used_at,
        user_id,
        created_at,
        updated_at
      )
    `)
    .neq('seller_id', user.id)
    .order('listed_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? [])
    .filter((listing) => listing.nfts !== null)
    .map((listing) => {
      const { user_id: _, ...nft } = listing.nfts as NonNullable<typeof listing.nfts>
      return { ...nft, isListed: true as const, price: listing.price }
    })
}

/**
 * Hook to fetch marketplace listings (NFTs from other users) via React Query.
 *
 * All consumers share a single cache entry (`queryKeys.marketplaceListings`).
 * Mutation hooks (list/unlist) invalidate this key after success.
 */
export function useMarketplaceListings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.marketplaceListings,
    queryFn: fetchMarketplaceListings,
  })

  return {
    listings: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  }
}
