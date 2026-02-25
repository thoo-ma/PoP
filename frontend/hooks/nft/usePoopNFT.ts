import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorHelpers';

export interface PoopResult {
  id: string;
  /** Energy value after the use */
  energy: number;
  energy_lost: number;
  depleted: boolean;
  /** XP within the current level after the use */
  xp: number;
  /** XP earned this poop */
  xp_gained: number;
  /** Level after the use */
  level: number;
  /** Whether the NFT leveled up this poop */
  leveled_up: boolean;
}

/**
 * Hook to consume a single use of an NFT (the "poop" action).
 *
 * All game logic — energy drain formula, tier multiplier, resilience factor —
 * runs server-side in the `use-nft` Edge Function for tamper-resistance.
 */
export function usePoopNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const poopNFT = useCallback(async (nftId: string): Promise<PoopResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('use-nft', {
        body: { nft_id: nftId },
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
        logError('usePoopNFT:Invoke', fnError);
        setError(message);
        return null;
      }

      if (!data) {
        setError('No data returned from use-nft function');
        return null;
      }

      return data as PoopResult;
    } catch (err) {
      logError('usePoopNFT:Poop', err);
      setError(err instanceof Error ? err.message : 'Failed to use NFT');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { poopNFT, loading, error };
}
