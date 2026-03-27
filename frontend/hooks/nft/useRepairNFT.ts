import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorHelpers';
import { useToast } from 'heroui-native';
import { useGameConfig } from '@/store/gameConfigStore';
import { degenBarConfigHash } from '@pop/shared/degenBar';
import type { EdgeFunctionErrorResponse, InsufficientPoopDetails, BustedDetails } from '@pop/shared';

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
 * @returns A `repairNFT(nftId, newEnergy, degenPercent)` callback resolving to `RepairResult | null`,
 *   async state (`loading`, `error`), `insufficientPoopError`, and `bustedResult` when the
 *   degen roll busts.
 */
export function useRepairNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insufficientPoopError, setInsufficientPoopError] = useState<InsufficientPoopError | null>(null);
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null);

  const { config, refetch: refetchConfig } = useGameConfig();
  const { toast } = useToast();

  const repairNFT = useCallback(async (nftId: string, newEnergy: number, degenPercent = 0): Promise<RepairResult | null> => {
    try {
      setLoading(true);
      setError(null);
      setInsufficientPoopError(null);
      setBustedResult(null);

      const { data, error: fnError } = await supabase.functions.invoke('repair-nft', {
        body: { nft_id: nftId, new_energy: newEnergy, degen_percent: degenPercent },
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
        // Degen bust
        if (body?.error === 'busted') {
          const d = body.details as unknown as BustedDetails | undefined;
          setBustedResult({
            poop_spent:   d?.poop_spent   ?? 0,
            poop_balance: d?.poop_balance ?? 0,
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

      // Detect config drift
      const responseHash = (data as { config_hash?: string }).config_hash;
      if (responseHash && responseHash !== degenBarConfigHash(config.degen_bar)) {
        void refetchConfig();
        toast.show({
          variant: 'default',
          label: 'Settings updated',
          description: 'Game settings updated — odds may have changed',
        });
      }

      return data as RepairResult;
    } catch (err) {
      logError('useRepairNFT:Repair', err);
      setError(err instanceof Error ? err.message : 'Failed to repair NFT');
      return null;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.degen_bar, refetchConfig]);

  return { repairNFT, loading, error, insufficientPoopError, bustedResult };
}
