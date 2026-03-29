import { useState, useCallback } from 'react'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

export interface RollLootResult {
  won: boolean
  holds_used: number
  box?: { id: string; rarity: string }
}

export interface HoldLootResult {
  /** Updated holds count after this hold (1–3) */
  holds: number
}

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

      const { data, error: fnError } = await supabase.functions.invoke('hold-loot-roll', {
        body: { loot_roll_id: lootRollId },
      })

      if (fnError) {
        let message: string = fnError.message
        if (fnError instanceof FunctionsHttpError) {
          try {
            const body = await fnError.context.json()
            if (body?.message) message = body.message as string
            else if (body?.error) message = body.error as string
          } catch {
            /* leave message as-is */
          }
        }
        logError('useRollLoot:Hold', fnError)
        setError(message ?? 'Failed to hold loot roll')
        return null
      }

      return data as HoldLootResult
    } catch (err) {
      logError('useRollLoot:Hold', err)
      setError(err instanceof Error ? err.message : 'Failed to hold loot roll')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const rollLoot = useCallback(async (lootRollId: string): Promise<RollLootResult | null> => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fnError } = await supabase.functions.invoke('roll-loot', {
        body: { loot_roll_id: lootRollId },
      })

      if (fnError) {
        let message: string = fnError.message
        if (fnError instanceof FunctionsHttpError) {
          try {
            const body = await fnError.context.json()
            if (body?.message) message = body.message as string
            else if (body?.error) message = body.error as string
          } catch {
            /* leave message as-is */
          }
        }
        logError('useRollLoot:Roll', fnError)
        setError(message ?? 'Failed to roll loot')
        return null
      }

      return data as RollLootResult
    } catch (err) {
      logError('useRollLoot:Roll', err)
      setError(err instanceof Error ? err.message : 'Failed to roll loot')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { holdLootRoll, rollLoot, loading, error }
}
