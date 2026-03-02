import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MysteryBox } from '@shared';

interface UseMysteryBoxesResult {
  /** Fetched mystery boxes owned by the current user, newest first. */
  boxes: MysteryBox[];
  /** True while the fetch or refetch is in flight. */
  loading: boolean;
  /** Error message from the last failed fetch, or `null`. */
  error: string | null;
  /** Re-fetches mystery boxes from Supabase. */
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage the current user's mystery boxes.
 *
 * Fetches all unopened and opened boxes from the `mystery_boxes` table,
 * ordered newest-first. Re-fetches automatically on mount.
 *
 * @returns The user's mystery boxes (`boxes`), async state (`loading`, `error`),
 *   and a manual `refetch` callback.
 */
export function useMysteryBoxes(): UseMysteryBoxesResult {
  const [boxes, setBoxes] = useState<MysteryBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBoxes([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('mystery_boxes')
        .select('id, rarity, image_url, opened, created_at')
        .eq('user_id', user.id)
        .eq('opened', false)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setBoxes((data ?? []) as MysteryBox[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mystery boxes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { boxes, loading, error, refetch };
}
