import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorHelpers';

export interface StatDeltas {
  efficiency: number;
  resilience: number;
  comfort:    number;
  luck:       number;
}

export interface AllocateResult {
  id:          string;
  efficiency:  number;
  resilience:  number;
  comfort:     number;
  luck:        number;
  stat_points: number;
}

/**
 * Hook to spend unspent stat points on an NFT.
 *
 * All validation (sufficient points, stat cap, ownership) runs server-side
 * in the `allocate-stat-points` Edge Function for tamper-resistance.
 *
 * @returns An `allocate(nftId, deltas)` callback resolving to `AllocateResult | null`,
 *   plus `loading` and `error` state.
 */
export function useAllocateStatPoints() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]   = useState<string | null>(null);

  const allocate = useCallback(
    async (nftId: string, deltas: StatDeltas): Promise<AllocateResult | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke('allocate-stat-points', {
          body: {
            nft_id:     nftId,
            efficiency: deltas.efficiency,
            resilience: deltas.resilience,
            comfort:    deltas.comfort,
            luck:       deltas.luck,
          },
        });

        if (fnError) {
          let message: string = fnError.message;
          if (fnError instanceof FunctionsHttpError) {
            try {
              const body = await fnError.context.json();
              if (body?.message) message = body.message as string;
              else if (body?.error) message = body.error as string;
            } catch { /* leave message as-is */ }
          }
          logError('useAllocateStatPoints:invoke', fnError);
          setError(message);
          return null;
        }

        if (!data) {
          setError('No data returned from allocate-stat-points function');
          return null;
        }

        return data as AllocateResult;
      } catch (err) {
        logError('useAllocateStatPoints:allocate', err);
        setError(err instanceof Error ? err.message : 'Failed to allocate stat points');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { allocate, loading, error };
}
