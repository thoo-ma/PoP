import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { logError } from "@/utils/errorHelpers";

/**
 * Hook to update NFT properties (energy, listing status, etc.).
 *
 * Each operation (`updateEnergy`, `listNFT`, `unlistNFT`) has its own
 * independent loading flag so callers can reflect the correct pending state
 * without one operation masking another.
 *
 * @returns Three mutation callbacks and their individual loading flags, plus a
 *   shared `error` string for the most recent failure.
 */
export function useUpdateNFT() {
  const [loadingUpdateEnergy, setLoadingUpdateEnergy] = useState<boolean>(false);
  const [loadingListNFT, setLoadingListNFT] = useState<boolean>(false);
  const [loadingUnlistNFT, setLoadingUnlistNFT] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEnergy = useCallback(async (nftId: string, newEnergy: number) => {
    try {
      setLoadingUpdateEnergy(true);
      setError(null);

      const clampedEnergy = Math.max(0, Math.min(100, newEnergy));

      const { error: updateError } = await supabase
        .from("nfts")
        .update({ energy: clampedEnergy })
        .eq("id", nftId);

      if (updateError) {
        logError("useUpdateNFT:UpdateEnergy", updateError);
        setError(updateError.message);
        return false;
      }

      return true;
    } catch (err) {
      logError("useUpdateNFT:UpdateEnergy", err);
      setError(err instanceof Error ? err.message : "Failed to update energy");
      return false;
    } finally {
      setLoadingUpdateEnergy(false);
    }
  }, []);

  const listNFT = useCallback(async (nftId: string, price: string) => {
    try {
      setLoadingListNFT(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        return false;
      }

      const { error: listError } = await supabase.from("marketplace_listings").insert({
        nft_id: nftId,
        seller_id: user.id,
        price,
      });

      if (listError) {
        logError("useUpdateNFT:ListNFT", listError);
        // Unique constraint violation — nft_id already has a listing row.
        setError(
          listError.code === "23505"
            ? "This NFT is already listed on the marketplace."
            : listError.message,
        );
        return false;
      }

      return true;
    } catch (err) {
      logError("useUpdateNFT:ListNFT", err);
      setError(err instanceof Error ? err.message : "Failed to list NFT");
      return false;
    } finally {
      setLoadingListNFT(false);
    }
  }, []);

  const unlistNFT = useCallback(async (nftId: string) => {
    try {
      setLoadingUnlistNFT(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        return false;
      }

      const { error: unlistError } = await supabase
        .from("marketplace_listings")
        .delete()
        .eq("nft_id", nftId)
        .eq("seller_id", user.id);

      if (unlistError) {
        logError("useUpdateNFT:UnlistNFT", unlistError);
        setError(unlistError.message);
        return false;
      }

      return true;
    } catch (err) {
      logError("useUpdateNFT:UnlistNFT", err);
      setError(err instanceof Error ? err.message : "Failed to unlist NFT");
      return false;
    } finally {
      setLoadingUnlistNFT(false);
    }
  }, []);

  return {
    updateEnergy,
    listNFT,
    unlistNFT,
    loadingUpdateEnergy,
    loadingListNFT,
    loadingUnlistNFT,
    error,
  };
}
