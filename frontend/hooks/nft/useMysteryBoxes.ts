import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MysteryBox } from '@shared';

interface UseMysteryBoxesResult {
  boxes: MysteryBox[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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
