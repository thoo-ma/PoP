import type { BustedDetails, MysteryBox } from '@pop/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import { BustedError, breedNFTs as invokeBreedNFTs } from '@/lib/edgeFunctions'
import { logError } from '@/utils/errorHelpers'

export function useBreedNFT() {
  const mock = useDevMock()
  const queryClient = useQueryClient()
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null)

  const mutation = useMutation<
    MysteryBox,
    Error,
    { parent1Id: string; parent2Id: string; degenPercent: number }
  >({
    mutationFn: ({ parent1Id, parent2Id, degenPercent }) =>
      invokeBreedNFTs(parent1Id, parent2Id, degenPercent),
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

  const breedNFTs = async (
    parent1Id: string,
    parent2Id: string,
    degenPercent = 0,
  ): Promise<MysteryBox | null> => {
    try {
      return await mutation.mutateAsync({ parent1Id, parent2Id, degenPercent })
    } catch {
      return null
    }
  }

  if (mock?.breedNFT) return mock.breedNFT
  return {
    breedNFTs,
    isPending: mutation.isPending,
    error:
      mutation.error && !(mutation.error instanceof BustedError) ? mutation.error.message : null,
    bustedResult,
  }
}
