import type { OpenMysteryBoxResponse } from '@pop/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import {
  openMysteryBox as invokeOpenMysteryBox,
  ResponseValidationError,
} from '@/lib/edgeFunctions'
import { logError } from '@/utils/errorHelpers'

export type { OpenMysteryBoxResponse }

/**
 * Hook to open a mystery box and receive a new toilet NFT.
 * All game logic (stat roll, type selection, image URL generation) runs
 * server-side in the `open-mystery-box` Supabase Edge Function.
 *
 * @returns An `openBox(boxId)` callback that resolves to the newly minted
 *   `OpenMysteryBoxResponse` or `null`, plus `isPending` and `error` state.
 */
export function useOpenMysteryBox() {
  const queryClient = useQueryClient()

  const mutation = useMutation<OpenMysteryBoxResponse, Error, string>({
    mutationFn: (boxId) => invokeOpenMysteryBox(boxId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mysteryBoxes }),
      ])
    },
    onError: (err) => {
      if (err instanceof ResponseValidationError) {
        logError('useOpenMysteryBox:ResponseValidation', err.zodError)
        return
      }
      logError('useOpenMysteryBox:Invoke', err)
    },
  })

  const openBox = async (boxId: string): Promise<OpenMysteryBoxResponse | null> => {
    try {
      return await mutation.mutateAsync(boxId)
    } catch {
      return null
    }
  }

  return {
    openBox,
    isPending: mutation.isPending,
    error:
      mutation.error instanceof ResponseValidationError
        ? 'Server returned an unexpected response'
        : (mutation.error?.message ?? null),
  }
}
