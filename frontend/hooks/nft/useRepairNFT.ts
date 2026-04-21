import type { BustedDetails, EdgeFunctionErrorResponse, InsufficientPoopDetails } from '@pop/shared'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

export interface RepairResult {
  id: string
  /** Energy value after the repair */
  energy: number
  /** POOP spent for this repair */
  poop_spent: number
  /** Updated wallet balance */
  poop_balance: number
}

export interface InsufficientPoopError {
  poop_balance: number
  poop_required: number
}

/** Custom error thrown when the user can't afford the repair. */
class InsufficientPoopErrorClass extends Error {
  constructor(public details: InsufficientPoopError) {
    super('insufficient_poop')
  }
}

/** Custom error thrown when the degen roll busts the repair attempt. */
class BustedError extends Error {
  constructor(public details: BustedDetails) {
    super('busted')
  }
}

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
  const [insufficientPoopError, setInsufficientPoopError] = useState<InsufficientPoopError | null>(
    null,
  )
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null)

  const mutation = useMutation<
    RepairResult,
    Error,
    { nftId: string; newEnergy: number; degenPercent: number }
  >({
    mutationFn: async ({ nftId, newEnergy, degenPercent }) => {
      const { data, error: fnError } = await supabase.functions.invoke('repair-nft', {
        body: { nft_id: nftId, new_energy: newEnergy, degen_percent: degenPercent },
      })

      if (fnError) {
        let message: string = fnError.message
        let body: EdgeFunctionErrorResponse | null = null
        if (fnError instanceof FunctionsHttpError) {
          try {
            body = await fnError.context.json()
            if (body?.message) message = body.message
            else if (body?.error) message = body.error
          } catch {
            /* leave message as-is */
          }
        }
        // Structured insufficient POOP error from the server
        if (body?.error === 'insufficient_poop' && body?.details) {
          const d = body.details as unknown as InsufficientPoopDetails
          throw new InsufficientPoopErrorClass({
            poop_balance: d.poop_balance,
            poop_required: d.poop_required,
          })
        }
        // Degen bust
        if (body?.error === 'busted') {
          const d = body.details as unknown as BustedDetails | undefined
          throw new BustedError({
            poop_spent: d?.poop_spent ?? 0,
            poop_balance: d?.poop_balance ?? 0,
          })
        }
        throw new Error(message)
      }

      if (!data) throw new Error('No data returned from repair-nft function')

      return data as RepairResult
    },
    onMutate: () => {
      setInsufficientPoopError(null)
      setBustedResult(null)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
    },
    onError: (err) => {
      if (err instanceof InsufficientPoopErrorClass) {
        setInsufficientPoopError(err.details)
        return
      }
      if (err instanceof BustedError) {
        setBustedResult(err.details)
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
      mutation.error &&
      !(mutation.error instanceof InsufficientPoopErrorClass) &&
      !(mutation.error instanceof BustedError)
        ? mutation.error.message
        : null,
    insufficientPoopError,
    bustedResult,
  }
}
