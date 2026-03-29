import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { MysteryBox } from "@pop/shared";

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
 * Fetches all unopened boxes from `mystery_boxes`, ordered newest-first.
 * Uses `getSession()` (local storage read) rather than `getUser()` (network
 * round-trip) to avoid a silent failure on component mount. Also subscribes
 * to Supabase Realtime so the list updates automatically on INSERT.
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
      // getSession() reads from local storage — fast and reliable on remount.
      // getUser() does a network trip and can return null during token refresh.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setBoxes([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("mystery_boxes")
        .select("id, rarity, image_url, opened, created_at")
        .eq("user_id", session.user.id)
        .eq("opened", false)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setBoxes((data ?? []) as MysteryBox[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mystery boxes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + realtime subscription for live updates
  useEffect(() => {
    refetch();

    // Subscribe to any INSERT/UPDATE on mystery_boxes so the list stays
    // current even when the component stays mounted (e.g. wider windowSize).
    const channel = supabase
      .channel("mystery-boxes-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "mystery_boxes" }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { boxes, loading, error, refetch };
}
