import { useState, useCallback } from 'react'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { MysteryBox, BustedDetails } from '@pop/shared'
import { logError } from '@/utils/errorHelpers'
import { useToast } from 'heroui-native'
import { useGameConfig } from '@/store/gameConfigStore'
import { degenBarConfigHash } from '@pop/shared/degenBar'

export function useBreedNFT() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [bustedResult, setBustedResult] = useState<BustedDetails | null>(null)

  const { config, refetch: refetchConfig } = useGameConfig()
  const { toast } = useToast()

  const breedNFTs = useCallback(
    async (parent1Id: string, parent2Id: string, degenPercent = 0) => {
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

        // Detect config drift
        const responseHash = (data as { config_hash?: string }).config_hash
        if (responseHash && responseHash !== degenBarConfigHash(config.degen_bar)) {
          void refetchConfig()
          toast.show({
            variant: 'default',
            label: 'Settings updated',
            description: 'Game settings updated — odds may have changed',
          })
        }

        return data as MysteryBox
      } catch (err) {
        logError('useBreedNFT:Breed', err)
        setError(err instanceof Error ? err.message : 'Failed to breed NFTs')
        return null
      } finally {
        setLoading(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [config.degen_bar, refetchConfig, toast.show],
  )

  return {
    breedNFTs,
    loading,
    error,
    bustedResult,
  }
}
