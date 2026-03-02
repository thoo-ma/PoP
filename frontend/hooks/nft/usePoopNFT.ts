import { useState, useCallback } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorHelpers';

export interface CooldownError {
  cooldown_ends_at: string;
  cooldown_remaining_seconds: number;
}

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
  /** Total unspent stat points on the NFT after this poop */
  stat_points: number;
  /** POOP currency earned this use */
  poop_earned: number;
  /** Updated wallet balance after this use */
  poop_balance: number;
}

/**
 * Hook to consume a single use of an NFT (the "poop" action).
 *
 * All game logic — energy drain formula, type multiplier, resilience factor —
 * runs server-side in the `use-nft` Edge Function for tamper-resistance.
 *
 * @returns A `poopNFT(nftId)` callback resolving to `PoopResult | null`,
 *   async state (`loading`, `error`), and a `cooldownError` object when the
 *   NFT is still resting (contains `cooldown_ends_at` and `cooldown_remaining_seconds`).
 */
export function usePoopNFT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownError, setCooldownError] = useState<CooldownError | null>(null);

  const poopNFT = useCallback(async (nftId: string): Promise<PoopResult | null> => {
    try {
      setLoading(true);
      setError(null);
      setCooldownError(null);

      const { data, error: fnError } = await supabase.functions.invoke('use-nft', {
        body: { nft_id: nftId },
      });

      if (fnError) {
        let message: string = fnError.message;
        let body: Record<string, unknown> | null = null;
        if (fnError instanceof FunctionsHttpError) {
          try {
            body = await fnError.context.json();
            if (body?.message) message = body.message as string;
            else if (body?.error) message = body.error as string;
          } catch { /* leave message as-is */ }
        }
        // Structured cooldown error from the server
        if (body?.error === 'on_cooldown' && body?.cooldown_ends_at) {
          setCooldownError({
            cooldown_ends_at:           body.cooldown_ends_at as string,
            cooldown_remaining_seconds: body.cooldown_remaining_seconds as number,
          });
          return null;
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

  return { poopNFT, loading, error, cooldownError };
}
