import type { CooldownDetails, EdgeFunctionErrorResponse } from '@pop/shared'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { queryKeys } from '@/constants'
import { useDevMock } from '@/lib/devMock'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

export interface CooldownError {
  cooldown_ends_at: string
  cooldown_remaining_seconds: number
}

export interface PoopResult {
  id: string
  /** Energy value after the use */
  energy: number
  energy_lost: number
  depleted: boolean
  /** XP within the current level after the use */
  xp: number
  /** XP earned this poop */
  xp_gained: number
  /** Level after the use */
  level: number
  /** Whether the NFT leveled up this poop */
  leveled_up: boolean
  /** Total unspent stat points on the NFT after this poop */
  stat_points: number
  /** POOP currency earned this use */
  poop_earned: number
  /** Updated wallet balance after this use */
  poop_balance: number
  /** ID of the newly created pending loot roll — pass to useRollLoot */
  loot_roll_id: string | null
}

/** Custom error thrown when the NFT is still on cooldown. */
class CooldownErrorClass extends Error {
  constructor(public details: CooldownError) {
    super('on_cooldown')
  }
}

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
  const [cooldownError, setCooldownError] = useState<CooldownError | null>(null)

  const mutation = useMutation<PoopResult, Error, string>({
    mutationFn: async (nftId) => {
      const { data, error: fnError } = await supabase.functions.invoke('use-nft', {
        body: { nft_id: nftId },
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
        // Structured cooldown error from the server
        if (body?.error === 'on_cooldown' && body?.details) {
          const d = body.details as unknown as CooldownDetails
          throw new CooldownErrorClass({
            cooldown_ends_at: d.cooldown_ends_at,
            cooldown_remaining_seconds: d.cooldown_remaining_seconds,
          })
        }
        throw new Error(message)
      }

      if (!data) throw new Error('No data returned from use-nft function')

      return data as PoopResult
    },
    onMutate: () => {
      setCooldownError(null)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userNFTs })
    },
    onError: (err) => {
      if (err instanceof CooldownErrorClass) {
        setCooldownError(err.details)
        return
      }
      logError('usePoopNFT:Invoke', err)
    },
  })

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
      mutation.error && !(mutation.error instanceof CooldownErrorClass)
        ? mutation.error.message
        : null,
    cooldownError,
  }
}
