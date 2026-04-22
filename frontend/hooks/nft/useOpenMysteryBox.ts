import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { openMysteryBox as invokeOpenMysteryBox } from '@/lib/edgeFunctions'
import type { NFT } from '@/types'
import { logError } from '@/utils/errorHelpers'

/**
 * Hook to open a mystery box and receive a new toilet NFT.
 * All game logic (stat roll, type selection, image URL generation) runs
 * server-side in the `open-mystery-box` Supabase Edge Function.
 *
 * @returns An `openBox(boxId)` callback that resolves to the newly minted
 *   `NFT` or `null`, plus `isPending` and `error` state.
 */
export function useOpenMysteryBox() {
  const queryClient = useQueryClient()

  const mutation = useMutation<NFT, Error, string>({
    mutationFn: (boxId) => invokeOpenMysteryBox(boxId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mysteryBoxes }),
      ])
    },
    onError: (err) => {
      logError('useOpenMysteryBox:Invoke', err)
    },
  })

  const openBox = async (boxId: string): Promise<NFT | null> => {
    try {
      return await mutation.mutateAsync(boxId)
    } catch {
      return null
    }
  }

  return {
    openBox,
    isPending: mutation.isPending,
    error: mutation.error?.message ?? null,
  }
}
