import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logError } from '../../utils/errorHelpers';

/**
 * Hook to update NFT properties (energy, listing status, etc.).
 * Note: `loading` is shared across all three operations — only one
 * should be initiated at a time from the calling component.
 */
export function useUpdateNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEnergy = useCallback(async (nftId: string, newEnergy: number) => {
    try {
      setLoading(true);
      setError(null);

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
