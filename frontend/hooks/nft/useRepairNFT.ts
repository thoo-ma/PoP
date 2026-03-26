import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorHelpers';
import type { EdgeFunctionErrorResponse, InsufficientPoopDetails } from '@pop/shared';

export interface RepairResult {
  id: string;
  /** Energy value after the repair */
  energy: number;
  /** POOP spent for this repair */
  poop_spent: number;
  /** Updated wallet balance */
  poop_balance: number;
}

export interface InsufficientPoopError {
  poop_balance: number;
  poop_required: number;
}

/**
 * Hook to repair an NFT's energy via the server-side `repair-nft` Edge Function.
 *
 * Replaces the previous direct client-side DB write so that the POOP cost
 * is enforced server-side and cannot be bypassed.
 *
 * @returns A `repairNFT(nftId, newEnergy)` callback resolving to `RepairResult | null`,
 *   async state (`loading`, `error`), and an `insufficientPoopError` object when the
 *   user's wallet doesn't have enough POOP to cover the repair cost.
 */
export function useRepairNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insufficientPoopError, setInsufficientPoopError] = useState<InsufficientPoopError | null>(null);

  const repairNFT = useCallback(async (nftId: string, newEnergy: number): Promise<RepairResult | null> => {
    try {
      setLoading(true);
      setError(null);
      setInsufficientPoopError(null);

      const { data, error: fnError } = await supabase.functions.invoke('repair-nft', {
        body: { nft_id: nftId, new_energy: newEnergy },
      });

      if (fnError) {
        let message: string = fnError.message;
        let body: EdgeFunctionErrorResponse | null = null;
        if (fnError instanceof FunctionsHttpError) {
          try {
            body = await fnError.context.json();
            if (body?.message) message = body.message;
            else if (body?.error) message = body.error;
          } catch { /* leave message as-is */ }
        }
        // Structured insufficient POOP error from the server
        if (body?.error === 'insufficient_poop' && body?.details) {
          const d = body.details as unknown as InsufficientPoopDetails;
          setInsufficientPoopError({
            poop_balance:  d.poop_balance,
            poop_required: d.poop_required,
          });
          return null;
        }
        logError('useRepairNFT:Invoke', fnError);
        setError(message);
        return null;
      }

      if (!data) {
        setError('No data returned from repair-nft function');
        return null;
      }

      return data as RepairResult;
    } catch (err) {
      logError('useRepairNFT:Repair', err);
      setError(err instanceof Error ? err.message : 'Failed to repair NFT');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { repairNFT, loading, error, insufficientPoopError };
}
