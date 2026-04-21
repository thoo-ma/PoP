import { useCallback, useEffect, useState } from 'react'
import { useDevMock } from '@/lib/devMock'
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
  const mock = useDevMock()
  const [poopBalance, setPoopBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // kept: in the useEffect dep array below; recreating on every render would tear down and re-establish
  // the Supabase realtime channel subscription on each render.
  const fetchBalance = useCallback(
    async (userId: string) => {
      if (mock?.wallet) return
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
    },
    [mock?.wallet],
  )

  useEffect(() => {
    if (mock?.wallet) return
    let userId: string | null = null
    let channel: ReturnType<typeof supabase.channel> | null = null

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        setLoading(false)
        return
      }

      userId = session.user.id
      await fetchBalance(session.user.id)

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
  }, [fetchBalance, mock?.wallet])

  const refetch = async () => {
    setLoading(true)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      setLoading(false)
      return
    }
    await fetchBalance(session.user.id)
  }

  if (mock?.wallet) return mock.wallet
  return { poopBalance, loading, error, refetch }
}
