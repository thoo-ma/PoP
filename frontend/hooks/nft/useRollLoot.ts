import { useCallback, useState } from 'react'
import {
  type HoldLootResult,
  holdLootRoll as invokeHoldLootRoll,
  rollLoot as invokeRollLoot,
  ResponseValidationError,
  type RollLootResult,
} from '@/lib/edgeFunctions'
import { logError } from '@/utils/errorHelpers'

export type { HoldLootResult, RollLootResult }

/**
 * Hook for the post-use-NFT loot roulette.
 *
 * Exposes two actions:
 * - `holdLootRoll(lootRollId)` — increments the hold counter server-side (+10% loot chance)
 * - `rollLoot(lootRollId)` — performs the server-side probability roll; deletes the pending row
 *
 * Both share a single loading/error state since only one action can be in
 * flight at a time.
 */
export function useRollLoot() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const holdLootRoll = useCallback(async (lootRollId: string): Promise<HoldLootResult | null> => {
    try {
      setLoading(true)
      setError(null)
      return await invokeHoldLootRoll(lootRollId)
    } catch (err) {
      if (err instanceof ResponseValidationError) {
        logError('useRollLoot:HoldResponseValidation', err.zodError)
        setError('Server returned an unexpected response')
      } else {
        logError('useRollLoot:Hold', err)
        setError(err instanceof Error ? err.message : 'Failed to hold loot roll')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const rollLoot = useCallback(async (lootRollId: string): Promise<RollLootResult | null> => {
    try {
      setLoading(true)
      setError(null)
      return await invokeRollLoot(lootRollId)
    } catch (err) {
      if (err instanceof ResponseValidationError) {
        logError('useRollLoot:RollResponseValidation', err.zodError)
        setError('Server returned an unexpected response')
      } else {
        logError('useRollLoot:Roll', err)
        setError(err instanceof Error ? err.message : 'Failed to roll loot')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { holdLootRoll, rollLoot, loading, error }
}
