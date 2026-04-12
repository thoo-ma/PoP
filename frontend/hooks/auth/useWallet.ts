import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

/**
 * Hook that subscribes to the current user's POOP wallet balance.
 *
 * Fetches the initial balance from `public.users` and keeps it up to date
 * via a Supabase Realtime channel so the UI reflects server-side changes
 * (e.g. earning POOP from a flush, spending on repair or breed) without
 * requiring explicit refetches.
 *
 * @returns `{ poopBalance, loading, error, refetch }` — `poopBalance` is
 *   `null` while loading, and a `number` once fetched.
 */
export function useWallet() {
  const [poopBalance, setPoopBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async (userId: string) => {
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('poop_balance')
      .eq('id', userId)
      .single()

    if (fetchError) {
      logError('useWallet:fetch', fetchError)
      setError(fetchError.message)
    } else {
      setPoopBalance(data?.poop_balance ?? 0)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let userId: string | null = null
    let channel: ReturnType<typeof supabase.channel> | null = null

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      userId = user.id
      await fetchBalance(user.id)

      // Realtime subscription so balance updates reflect immediately
      channel = supabase
        .channel(`wallet:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${userId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            if (payload.new && typeof payload.new.poop_balance === 'number') {
              setPoopBalance(payload.new.poop_balance as number)
            }
          },
        )
        .subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [fetchBalance])

  const refetch = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    await fetchBalance(user.id)
  }

  return { poopBalance, loading, error, refetch }
}
