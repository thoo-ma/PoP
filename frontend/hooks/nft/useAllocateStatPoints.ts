import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { allocateStatPoints } from '@/lib/edgeFunctions'
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
    mutationFn: ({ nftId, deltas }) => allocateStatPoints(nftId, deltas),
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
