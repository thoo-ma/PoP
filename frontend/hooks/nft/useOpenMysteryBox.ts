import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { NFT } from '@/types/nft';
import { logError } from '@/utils/errorHelpers';

/**
 * Hook to open a mystery box and receive a new toilet NFT.
 * All game logic (stat roll, type selection, image URL generation) runs
 * server-side in the `open-mystery-box` Supabase Edge Function.
 *
 * @returns An `openBox(boxId)` callback that resolves to the newly minted
 *   `NFT` or `null`, plus `loading` and `error` state.
 */
export function useOpenMysteryBox() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openBox = useCallback(async (boxId: string): Promise<NFT | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('open-mystery-box', {
        body: { box_id: boxId },
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
        logError('useOpenMysteryBox:Invoke', fnError);
        setError(message);
        return null;
      }

      if (!data) {
        setError('No data returned from open-mystery-box function');
        return null;
      }

      return data as NFT;
    } catch (err) {
      logError('useOpenMysteryBox:Open', err);
      setError(err instanceof Error ? err.message : 'Failed to open mystery box');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { openBox, loading, error };
}
