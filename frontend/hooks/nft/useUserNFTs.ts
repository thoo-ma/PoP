import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { NFT } from '@/types/nft';
import { logError } from '@/utils/errorHelpers';

/**
 * Hook to fetch and manage user's NFT collection.
 * Fetches NFTs from Supabase including marketplace listing status.
 */
export function useUserNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setNfts([]);
        setLoading(false);
        return;
      }

      const { data: nftsData, error: nftsError } = await supabase
        .from('nfts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (nftsError) {
        logError('useUserNFTs:Fetch', nftsError);
        setError(nftsError.message);
        setNfts([]);
        return;
      }

      const nftIds = nftsData?.map(nft => nft.id) ?? [];
      const listingsMap = new Map<string, string>();

      if (nftIds.length > 0) {
        const { data: listingsData, error: listingsError } = await supabase
          .from('marketplace_listings')
          .select('nft_id, price')
          .in('nft_id', nftIds);

        if (listingsError) {
          logError('useUserNFTs:FetchListings', listingsError);
        }
        listingsData?.forEach(l => listingsMap.set(l.nft_id, l.price));
      }

      const enrichedNfts: NFT[] = (nftsData ?? []).map(({ user_id: _, ...nft }) => ({
        ...nft,
        isListed: listingsMap.has(nft.id),
        price: listingsMap.get(nft.id),
      }));

      setNfts(enrichedNfts);
    } catch (err) {
      logError('useUserNFTs:Fetch', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNFTs,
  };
}
