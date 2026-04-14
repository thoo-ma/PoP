import type { BustedDetails, MysteryBox } from '@pop/shared'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

export function useBreedNFT() {
  const mock = useDevMock()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null)

  const breedNFTs = useCallback(
    async (parent1Id: string, parent2Id: string, degenPercent = 0) => {
      if (mock?.breedNFT) return null
      try {
        setLoading(true)
        setError(null)
        setBustedResult(null)

        const { data, error: fnError } = await supabase.functions.invoke('breed-nfts', {
          body: { parent1_id: parent1Id, parent2_id: parent2Id, degen_percent: degenPercent },
        })

        if (fnError) {
          let message: string = fnError.message
          let body: { error?: string; details?: unknown } | null = null
          if (fnError instanceof FunctionsHttpError) {
            try {
              body = await fnError.context.json()
              const bodyMsg = (body as { message?: string })?.message
              if (bodyMsg) message = bodyMsg
              else if (body?.error) message = body.error
            } catch {
              /* leave message as-is */
            }
          }
          // Degen bust
          if (body?.error === 'busted') {
            const d = body.details as unknown as BustedDetails | undefined
            setBustedResult({
              poop_spent: d?.poop_spent ?? 0,
              poop_balance: d?.poop_balance ?? 0,
            })
            return null
          }
          logError('useBreedNFT:Invoke', fnError)
          setError(message)
          return null
        }

        if (!data) {
          setError('No data returned from breed function')
          return null
        }

        await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
        await queryClient.invalidateQueries({ queryKey: queryKeys.mysteryBoxes })
        return data as MysteryBox
      } catch (err) {
        logError('useBreedNFT:Breed', err)
        setError(err instanceof Error ? err.message : 'Failed to breed NFTs')
        return null
      } finally {
        setLoading(false)
      }
    },
    [queryClient, mock],
  )

  if (mock?.breedNFT) return mock.breedNFT
  return {
    breedNFTs,
    loading,
    error,
    bustedResult,
  }
}
