import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { supabase } from '@/lib/supabase'
import type { AllocateResult, StatDeltas } from '@/types'
import { logError } from '@/utils/errorHelpers'

/**
 * Hook to spend unspent stat points on an NFT.
 *
 * All validation (sufficient points, stat cap, ownership) runs server-side
 * in the `allocate-stat-points` Edge Function for tamper-resistance.
 *
 * @returns An `allocate(nftId, deltas)` callback resolving to `AllocateResult | null`,
 *   plus `isPending` and `error` state.
 */
export function useAllocateStatPoints() {
  const queryClient = useQueryClient()

  const mutation = useMutation<AllocateResult, Error, { nftId: string; deltas: StatDeltas }>({
    mutationFn: async ({ nftId, deltas }) => {
      const { data, error: fnError } = await supabase.functions.invoke('allocate-stat-points', {
        body: {
          nft_id: nftId,
          efficiency: deltas.efficiency,
          resilience: deltas.resilience,
          comfort: deltas.comfort,
          luck: deltas.luck,
        },
      })

      if (fnError) {
        let message: string = fnError.message
        if (fnError instanceof FunctionsHttpError) {
          try {
            const body = await fnError.context.json()
            if (body?.message) message = body.message as string
            else if (body?.error) message = body.error as string
          } catch {
            /* leave message as-is */
          }
        }
        throw new Error(message)
      }

      if (!data) throw new Error('No data returned from allocate-stat-points function')

      return data as AllocateResult
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
    },
    onError: (err) => {
      logError('useAllocateStatPoints:invoke', err)
    },
  })

  const allocate = async (nftId: string, deltas: StatDeltas): Promise<AllocateResult | null> => {
    try {
      return await mutation.mutateAsync({ nftId, deltas })
    } catch {
      return null
    }
  }

  return {
    allocate,
    isPending: mutation.isPending,
    error: mutation.error?.message ?? null,
  }
}
