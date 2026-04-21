import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

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
  const queryClient = useQueryClient()

  const updateEnergyMutation = useMutation<true, Error, { nftId: string; newEnergy: number }>({
    mutationFn: async ({ nftId, newEnergy }) => {
      const clampedEnergy = Math.max(0, Math.min(100, newEnergy))

      const { error: updateError } = await supabase
        .from('nfts')
        .update({ energy: clampedEnergy })
        .eq('id', nftId)

      if (updateError) throw new Error(updateError.message)

      return true
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
    },
    onError: (err) => {
      logError('useUpdateNFT:UpdateEnergy', err)
    },
  })

  const listNFTMutation = useMutation<true, Error, { nftId: string; price: string }>({
    mutationFn: async ({ nftId, price }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error: listError } = await supabase.from('marketplace_listings').insert({
        nft_id: nftId,
        seller_id: session.user.id,
        price,
      })

      if (listError) {
        // Unique constraint violation — nft_id already has a listing row.
        throw new Error(
          listError.code === '23505'
            ? 'This NFT is already listed on the marketplace.'
            : listError.message,
        )
      }

      return true
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.marketplaceListings }),
      ])
    },
    onError: (err) => {
      logError('useUpdateNFT:ListNFT', err)
    },
  })

  const unlistNFTMutation = useMutation<true, Error, { nftId: string }>({
    mutationFn: async ({ nftId }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error: unlistError } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('nft_id', nftId)
        .eq('seller_id', session.user.id)

      if (unlistError) throw new Error(unlistError.message)

      return true
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.marketplaceListings }),
      ])
    },
    onError: (err) => {
      logError('useUpdateNFT:UnlistNFT', err)
    },
  })

  const updateEnergy = async (nftId: string, newEnergy: number): Promise<boolean> => {
    try {
      await updateEnergyMutation.mutateAsync({ nftId, newEnergy })
      return true
    } catch {
      return false
    }
  }

  const listNFT = async (nftId: string, price: string): Promise<boolean> => {
    try {
      await listNFTMutation.mutateAsync({ nftId, price })
      return true
    } catch {
      return false
    }
  }

  const unlistNFT = async (nftId: string): Promise<boolean> => {
    try {
      await unlistNFTMutation.mutateAsync({ nftId })
      return true
    } catch {
      return false
    }
  }

  return {
    updateEnergy,
    listNFT,
    unlistNFT,
    loadingUpdateEnergy: updateEnergyMutation.isPending,
    loadingListNFT: listNFTMutation.isPending,
    loadingUnlistNFT: unlistNFTMutation.isPending,
    // NOTE: Uses ?? to pick the first non-null error across mutations. React Query
    // error state persists until the same mutation reruns, so this can surface a
    // stale error from a prior operation. Acceptable while no consumer reads this
    // field; revisit with per-mutation error fields if that changes.
    error:
      updateEnergyMutation.error?.message ??
      listNFTMutation.error?.message ??
      unlistNFTMutation.error?.message ??
      null,
  }
}
