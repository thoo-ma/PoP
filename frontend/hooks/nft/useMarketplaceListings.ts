import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { NFT } from '@/types/nft'
import { logError } from '@/utils/errorHelpers'

/**
 * Hook to fetch marketplace listings (NFTs from other users).
 *
 * @returns Other users' listed NFTs (`listings`), async state (`loading`, `error`),
 *   and a `fetchListings` callback.
 */
export function useMarketplaceListings() {
  const [listings, setListings] = useState<NFT[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setListings([])
        return
      }

      const { data: listingsData, error: listingsError } = await supabase
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

      if (listingsError) {
        logError('useMarketplaceListings:Fetch', listingsError)
        setError(listingsError.message)
        setListings([])
        return
      }

      const enrichedListings: NFT[] = (listingsData ?? [])
        .filter((listing) => listing.nfts !== null)
        .map((listing) => {
          const { user_id: _, ...nft } = listing.nfts!
          return { ...nft, isListed: true as const, price: listing.price }
        })

      setListings(enrichedListings)
    } catch (err) {
      logError('useMarketplaceListings:Fetch', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch listings')
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
  }
}
