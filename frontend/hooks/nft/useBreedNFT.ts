import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { NFT } from '@/types/nft';
import { logError } from '@/utils/errorHelpers';

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
        let message: string = fnError.message;
        if (fnError instanceof FunctionsHttpError) {
          try {
            const body = await fnError.context.json();
            if (body?.message) message = body.message;
            else if (body?.error) message = body.error;
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

      return data as NFT;
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
