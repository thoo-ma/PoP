import type { BustedDetails, InsufficientPoopDetails } from '@pop/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import {
  BustedError,
  InsufficientPoopError,
  repairNFT as invokeRepairNFT,
  type RepairResult,
  ResponseValidationError,
} from '@/lib/edgeFunctions'
import { logError } from '@/utils/errorHelpers'

export type { RepairResult }

/**
 * Hook to repair an NFT's energy via the server-side `repair-nft` Edge Function.
 *
 * Replaces the previous direct client-side DB write so that the POOP cost
 * is enforced server-side and cannot be bypassed.
 *
 * @returns A `repairNFT(nftId, newEnergy, degenPercent)` callback resolving to `RepairResult | null`,
 *   async state (`isPending`, `error`), `insufficientPoopError`, and `bustedResult` when the
 *   degen roll busts.
 */
export function useRepairNFT() {
  const mock = useDevMock()
  const queryClient = useQueryClient()
  const [insufficientPoopError, setInsufficientPoopError] =
    useState<InsufficientPoopDetails | null>(null)
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null)

  const mutation = useMutation<
    RepairResult,
    Error,
    { nftId: string; newEnergy: number; degenPercent: number }
  >({
    mutationFn: ({ nftId, newEnergy, degenPercent }) =>
      invokeRepairNFT(nftId, newEnergy, degenPercent),
    onMutate: () => {
      setInsufficientPoopError(null)
      setBustedResult(null)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
    },
    onError: (err) => {
      if (err instanceof InsufficientPoopError) {
        setInsufficientPoopError(err.details)
        return
      }
      if (err instanceof BustedError) {
        setBustedResult(err.details)
        return
      }
      if (err instanceof ResponseValidationError) {
        logError('useRepairNFT:ResponseValidation', err.zodError)
        return
      }
      logError('useRepairNFT:Invoke', err)
    },
  })

  const repairNFT = async (
    nftId: string,
    newEnergy: number,
    degenPercent = 0,
  ): Promise<RepairResult | null> => {
    try {
      return await mutation.mutateAsync({ nftId, newEnergy, degenPercent })
    } catch {
      return null
    }
  }

  if (mock?.repairNFT) return mock.repairNFT
  return {
    repairNFT,
    isPending: mutation.isPending,
    error:
      mutation.error instanceof ResponseValidationError
        ? 'Server returned an unexpected response'
        : mutation.error &&
            !(mutation.error instanceof InsufficientPoopError) &&
            !(mutation.error instanceof BustedError)
          ? mutation.error.message
          : null,
    insufficientPoopError,
    bustedResult,
  }
}
