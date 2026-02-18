import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { NFT } from '../types/nft';
import { logError } from '../utils/errorHelpers';
import { getRandomVariant, formatVariantName } from '../constants';

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
 * Hook to breed two NFTs and create a new one
 * Averages parent stats with slight randomness
 */
export function useBreedNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const breedNFTs = useCallback(async (parent1Id: string, parent2Id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return null;
      }

      // Fetch both parent NFTs
      const { data: parents, error: parentsError } = await supabase
        .from('nfts')
        .select('*')
        .in('id', [parent1Id, parent2Id])
        .eq('user_id', user.id);

      if (parentsError || !parents || parents.length !== 2) {
        logError('useBreedNFT:FetchParents', parentsError);
        setError('Failed to fetch parent NFTs');
        return null;
      }

      const [parent1, parent2] = parents;

      // Calculate offspring stats (average with ±5% randomness)
      const calculateStat = (stat1: number, stat2: number) => {
        const avg = (stat1 + stat2) / 2;
        const randomness = (Math.random() - 0.5) * 10; // -5 to +5
        return Math.max(0, Math.min(100, Math.round(avg + randomness)));
      };

      // Determine offspring tier (weighted by parent tiers)
      const tierWeights: Record<'cruise-seat' | 'turbo-flush' | 'zen-fortress', number> = { 
        'cruise-seat': 1, 
        'turbo-flush': 2, 
        'zen-fortress': 3 
      };
      const avgTierWeight = (tierWeights[parent1.tier as 'cruise-seat' | 'turbo-flush' | 'zen-fortress'] + tierWeights[parent2.tier as 'cruise-seat' | 'turbo-flush' | 'zen-fortress']) / 2;
      let offspringTier: 'cruise-seat' | 'turbo-flush' | 'zen-fortress';
      
      if (avgTierWeight <= 1.5) {
        offspringTier = 'cruise-seat';
      } else if (avgTierWeight <= 2.5) {
        offspringTier = 'turbo-flush';
      } else {
        offspringTier = 'zen-fortress';
      }

      // Select random variant for the offspring tier
      const offspringVariant = getRandomVariant(offspringTier);
      
      // Determine offspring rarity (bred NFTs start at common)
      const offspringRarity = 'common';
      
      // Generate a proper display name from the variant
      const offspringName = `${formatVariantName(offspringVariant)}`;
      
      // Build image URL from Supabase Storage using new variant structure
      // Pattern: toilets/{tier}/{variant}/{variant}-{rarity}.jpg
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(`toilets/${offspringTier}/${offspringVariant}/${offspringVariant}-${offspringRarity}.jpg`);
      const imageUrl = urlData.publicUrl;

      // Create offspring NFT
      const { data: offspring, error: createError } = await supabase
        .from('nfts')
        .insert({
          user_id: user.id,
          name: offspringName,
          tier: offspringTier,
          variant: offspringVariant,
          rarity: offspringRarity,
          image_url: imageUrl,
          efficiency: calculateStat(parent1.efficiency, parent2.efficiency),
          resilience: calculateStat(parent1.resilience, parent2.resilience),
          comfort: calculateStat(parent1.comfort, parent2.comfort),
          luck: calculateStat(parent1.luck, parent2.luck),
          energy: 100, // New NFTs start with full energy
          level: 1,    // Start at level 1
        })
        .select()
        .single();

      if (createError) {
        logError('useBreedNFT:Create', createError);
        setError(createError.message);
        return null;
      }

      // Transform to NFT type
      const newNft: NFT = {
        id: offspring.id,
        name: offspring.name,
        image: offspring.image_url,
        tier: offspring.tier,
        variant: offspring.variant,
        rarity: offspring.rarity,
        efficiency: offspring.efficiency,
        resilience: offspring.resilience,
        comfort: offspring.comfort,
        luck: offspring.luck,
        energy: offspring.energy,
        level: offspring.level,
        created_at: offspring.created_at,
        updated_at: offspring.updated_at,
      };

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
