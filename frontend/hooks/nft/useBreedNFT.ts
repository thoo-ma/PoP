import type { BustedDetails, MysteryBox } from '@pop/shared'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

/** Custom error thrown when the degen roll busts the breed attempt. */
class BustedError extends Error {
  constructor(public details: BustedDetails) {
    super('busted')
  }
}

export function useBreedNFT() {
  const mock = useDevMock()
  const queryClient = useQueryClient()
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null)

  const mutation = useMutation<
    MysteryBox,
    Error,
    { parent1Id: string; parent2Id: string; degenPercent: number }
  >({
    mutationFn: async ({ parent1Id, parent2Id, degenPercent }) => {
      const { data, error: fnError } = await supabase.functions.invoke('breed-nfts', {
        body: { parent1_id: parent1Id, parent2_id: parent2Id, degen_percent: degenPercent },
      })

      if (fnError) {
        let message: string = fnError.message
        let body: { error?: string; details?: unknown; message?: string } | null = null
        if (fnError instanceof FunctionsHttpError) {
          try {
            body = await fnError.context.json()
            if (body?.message) message = body.message
            else if (body?.error) message = body.error
          } catch {
            /* leave message as-is */
          }
        }
        // Degen bust — structured domain error
        if (body?.error === 'busted') {
          const d = body.details as BustedDetails | undefined
          throw new BustedError({
            poop_spent: d?.poop_spent ?? 0,
            poop_balance: d?.poop_balance ?? 0,
          })
        }
        throw new Error(message)
      }

      if (!data) throw new Error('No data returned from breed function')

      return data as MysteryBox
    },
    onMutate: () => {
      setBustedResult(null)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mysteryBoxes }),
      ])
    },
    onError: (err) => {
      if (err instanceof BustedError) {
        setBustedResult(err.details)
        return
      }
      logError('useBreedNFT:Invoke', err)
    },
  })

  const breedNFTs = useCallback(
    async (parent1Id: string, parent2Id: string, degenPercent = 0): Promise<MysteryBox | null> => {
      try {
        return await mutation.mutateAsync({ parent1Id, parent2Id, degenPercent })
      } catch {
        return null
      }
    },
    [mutation.mutateAsync],
  )

  if (mock?.breedNFT) return mock.breedNFT
  return {
    breedNFTs,
    isPending: mutation.isPending,
    error:
      mutation.error && !(mutation.error instanceof BustedError) ? mutation.error.message : null,
    bustedResult,
  }
}
