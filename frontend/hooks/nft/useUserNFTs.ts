import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { NFT } from '@/types/nft';
import { logError } from '@/utils/errorHelpers';

/**
 * Hook to fetch and manage user's NFT collection.
 * Fetches NFTs from Supabase including marketplace listing status.
 *
 * @returns The user's NFT collection (`nfts`), async state (`loading`, `error`),
 *   and a `refetch` callback.
 */
export function useUserNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // getSession() reads from local storage — fast and reliable on remount.
      // getUser() does a network trip and can return null during token refresh.
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setNfts([]);
        setLoading(false);
        return;
      }

      const { data: nftsData, error: nftsError } = await supabase
        .from('nfts')
        .select('*, marketplace_listings(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (nftsError) {
        logError('useUserNFTs:Fetch', nftsError);
        setError(nftsError.message);
        setNfts([]);
        return;
      }

      const enrichedNfts: NFT[] = (nftsData ?? []).map(({ user_id: _, marketplace_listings, ...nft }) => ({
        ...nft,
        isListed: !!marketplace_listings,
        price: marketplace_listings?.price,
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
