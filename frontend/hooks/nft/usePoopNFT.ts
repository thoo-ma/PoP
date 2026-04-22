import type { CooldownDetails } from '@pop/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import { CooldownError, poopNFT as invokePoopNFT, type PoopResult } from '@/lib/edgeFunctions'
import { logError } from '@/utils/errorHelpers'

export type { PoopResult }

/**
 * Hook to consume a single use of an NFT (the "poop" action).
 *
 * All game logic — energy drain formula, type multiplier, resilience factor —
 * runs server-side in the `use-nft` Edge Function for tamper-resistance.
 *
 * @returns A `poopNFT(nftId)` callback resolving to `PoopResult | null`,
 *   async state (`isPending`, `error`), and a `cooldownError` object when the
 *   NFT is still resting (contains `cooldown_ends_at` and `cooldown_remaining_seconds`).
 */
export function usePoopNFT() {
  const mock = useDevMock()
  const queryClient = useQueryClient()
  const [cooldownError, setCooldownError] = useState<CooldownDetails | null>(null)

  const mutation = useMutation<PoopResult, Error, string>({
    mutationFn: (nftId) => invokePoopNFT(nftId),
    onMutate: () => {
      setCooldownError(null)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
    },
    onError: (err) => {
      if (err instanceof CooldownError) {
        setCooldownError(err.details)
        return
      }
      logError('usePoopNFT:Invoke', err)
    },
  })

  // kept: in the useEffect dep array in Poop.tsx that awards XP on flush detection; without useCallback
  // it recreates on every render, which would re-fire that effect and double-award XP.
  const poopNFT = useCallback(
    async (nftId: string): Promise<PoopResult | null> => {
      try {
        return await mutation.mutateAsync(nftId)
      } catch {
        return null
      }
    },
    [mutation.mutateAsync],
  )

  if (mock?.poopNFT) return mock.poopNFT
  return {
    poopNFT,
    isPending: mutation.isPending,
    error:
      mutation.error && !(mutation.error instanceof CooldownError) ? mutation.error.message : null,
    cooldownError,
  }
}
