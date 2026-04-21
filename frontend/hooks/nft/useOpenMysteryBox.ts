import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { queryKeys } from '@/constants'
import { supabase } from '@/lib/supabase'
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
    mutationFn: async (boxId) => {
      const { data, error: fnError } = await supabase.functions.invoke('open-mystery-box', {
        body: { box_id: boxId },
      })

      if (fnError) {
        let message: string = fnError.message
        if (fnError instanceof FunctionsHttpError) {
          try {
            const body = await fnError.context.json()
            if (body?.message) message = body.message
            else if (body?.error) message = body.error
          } catch {
            /* leave message as-is */
          }
        }
        throw new Error(message)
      }

      if (!data) throw new Error('No data returned from open-mystery-box function')

      return data as NFT
    },
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

  const openBox = useCallback(
    async (boxId: string): Promise<NFT | null> => {
      try {
        return await mutation.mutateAsync(boxId)
      } catch {
        return null
      }
    },
    [mutation.mutateAsync],
  )

  return {
    openBox,
    isPending: mutation.isPending,
    error: mutation.error?.message ?? null,
  }
}
