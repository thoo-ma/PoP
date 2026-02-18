import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { NFT } from '../types/nft';
import { logError } from '../utils/errorHelpers';

/**
 * Hook to fetch and manage user's NFT collection
 * Fetches NFTs from Supabase including marketplace listing status
 */
export function useUserNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setNfts([]);
        setLoading(false);
        return;
      }

      // Fetch user's NFTs with listing status
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

      // Fetch marketplace listings for these NFTs (skip if no NFTs)
      const nftIds = nftsData?.map(nft => nft.id) || [];
      let listingsData: Array<{ nft_id: string; price: string }> | null = null;

      if (nftIds.length > 0) {
        const { data, error: listingsError } = await supabase
          .from('marketplace_listings')
          .select('nft_id, price')
          .in('nft_id', nftIds);

        if (listingsError) {
          logError('useUserNFTs:FetchListings', listingsError);
        }
        listingsData = data;
      }

      // Combine NFT data with listing status
      const listingsMap = new Map(
        listingsData?.map(listing => [listing.nft_id, listing.price]) || []
      );

      const enrichedNfts: NFT[] = (nftsData || []).map(nft => ({
        id: nft.id,
        name: nft.name,
        image: nft.image_url,
        tier: nft.tier,
        variant: nft.variant,
        rarity: nft.rarity,
        efficiency: nft.efficiency,
        resilience: nft.resilience,
        comfort: nft.comfort,
        luck: nft.luck,
        energy: nft.energy,
        level: nft.level,
        isListed: listingsMap.has(nft.id),
        price: listingsMap.get(nft.id),
        created_at: nft.created_at,
        updated_at: nft.updated_at,
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

/**
 * Hook to update NFT properties (energy, listing status, etc.)
 */
export function useUpdateNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEnergy = useCallback(async (nftId: string, newEnergy: number) => {
    try {
      setLoading(true);
      setError(null);

      // Clamp energy between 0-100
      const clampedEnergy = Math.max(0, Math.min(100, newEnergy));

      const { error: updateError } = await supabase
        .from('nfts')
        .update({ energy: clampedEnergy })
        .eq('id', nftId);

      if (updateError) {
        logError('useUpdateNFT:UpdateEnergy', updateError);
        setError(updateError.message);
        return false;
      }

      return true;
    } catch (err) {
      logError('useUpdateNFT:UpdateEnergy', err);
      setError(err instanceof Error ? err.message : 'Failed to update energy');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const listNFT = useCallback(async (nftId: string, price: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return false;
      }

      const { error: listError } = await supabase
        .from('marketplace_listings')
        .insert({
          nft_id: nftId,
          seller_id: user.id,
          price,
        });

      if (listError) {
        logError('useUpdateNFT:ListNFT', listError);
        setError(listError.message);
        return false;
      }

      return true;
    } catch (err) {
      logError('useUpdateNFT:ListNFT', err);
      setError(err instanceof Error ? err.message : 'Failed to list NFT');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlistNFT = useCallback(async (nftId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: unlistError } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('nft_id', nftId);

      if (unlistError) {
        logError('useUpdateNFT:UnlistNFT', unlistError);
        setError(unlistError.message);
        return false;
      }

      return true;
    } catch (err) {
      logError('useUpdateNFT:UnlistNFT', err);
      setError(err instanceof Error ? err.message : 'Failed to unlist NFT');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateEnergy,
    listNFT,
    unlistNFT,
    loading,
    error,
  };
}

/**
 * Hook to fetch marketplace listings (NFTs from other users)
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
      
      // Fetch marketplace listings with NFT data (excluding user's own listings)
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
            tier,
            variant,
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

      // Transform data to NFT format
      const enrichedListings: NFT[] = (listingsData || [])
        .filter(listing => listing.nfts) // Filter out any null NFT joins
        .map(listing => {
          const nft = Array.isArray(listing.nfts) ? listing.nfts[0] : listing.nfts;
          return {
            id: nft.id,
            name: nft.name,
            image: nft.image_url,
            tier: nft.tier,
            variant: nft.variant,
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

/**
 * Hook to breed two NFTs and create a new one.
 * Rarity probability roll and all game logic run server-side in the
 * `breed-nfts` Supabase Edge Function for tamper-resistance.
 */
export function useBreedNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const breedNFTs = useCallback(async (parent1Id: string, parent2Id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('breed-nfts', {
        body: { parent1_id: parent1Id, parent2_id: parent2Id },
      });

      if (fnError) {
        // FunctionsHttpError carries the actual response body in `context`.
        // Try to read the JSON body first; fall back to the generic message.
        let message: string = fnError.message;
        try {
          const body = await (fnError as any).context?.json?.();
          if (body?.message) message = body.message;
          else if (body?.error) message = body.error;
        } catch {
          // context not available or not JSON – try parsing the message string
          try {
            const parsed = JSON.parse(fnError.message);
            if (parsed?.message) message = parsed.message;
          } catch { /* leave message as-is */ }
        }
        logError('useBreedNFT:Invoke', fnError);
        setError(message);
        return null;
      }

      if (!data) {
        setError('No data returned from breed function');
        return null;
      }

      const newNft: NFT = data as NFT;
      return newNft;
    } catch (err) {
      logError('useBreedNFT:Breed', err);
      setError(err instanceof Error ? err.message : 'Failed to breed NFTs');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    breedNFTs,
    loading,
    error,
  };
}
