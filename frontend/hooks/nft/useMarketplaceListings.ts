import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { NFT } from '@/types/nft';
import { logError } from '@/utils/errorHelpers';

/**
 * Hook to fetch marketplace listings (NFTs from other users).
 */
export function useMarketplaceListings() {
  const [listings, setListings] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

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
            user_id,
            created_at,
            updated_at
          )
        `)
        .neq('seller_id', user?.id || '00000000-0000-0000-0000-000000000000')
        .order('listed_at', { ascending: false });

      if (listingsError) {
        logError('useMarketplaceListings:Fetch', listingsError);
        setError(listingsError.message);
        setListings([]);
        return;
      }

      const enrichedListings: NFT[] = (listingsData || [])
        .filter(listing => listing.nfts)
        .map(listing => {
          const nft = Array.isArray(listing.nfts) ? listing.nfts[0] : listing.nfts;
          return {
            id: nft.id,
            name: nft.name,
            image: nft.image_url,
            type: nft.type,
            rarity: nft.rarity,
            efficiency: nft.efficiency,
            resilience: nft.resilience,
            comfort: nft.comfort,
            luck: nft.luck,
            energy: nft.energy,
            level: nft.level,
            isListed: true,
            price: listing.price,
            created_at: nft.created_at,
            updated_at: nft.updated_at,
          };
        });

      setListings(enrichedListings);
    } catch (err) {
      logError('useMarketplaceListings:Fetch', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
  };
}
