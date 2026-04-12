import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib'
import type { UseAuthReturn } from '@/types'

/**
 * Hook to manage the current Supabase auth session.
 *
 * Combines a one-time `getSession` call with a long-lived `onAuthStateChange`
 * listener so the session stays up to date across the app lifetime.
 *
 * @returns Session state (`session`, `user`, `isAuthenticated`, `loading`) and
 *   auth helpers (`signOut`, `getUserDisplayName`).
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen to authentication state changes.
    // Also calls setLoading(false) here so that if this listener fires before
    // the getSession callback resolves (race condition), the spinner is not
    // left hanging indefinitely.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { error }
    }
    return { error: null }
  }, [])

  const getUserDisplayName = useCallback((): string => {
    return session?.user.email || session?.user.user_metadata?.name || 'User'
  }, [session])

  return {
    session,
    loading,
    signOut,
    getUserDisplayName,
    user: session?.user ?? null,
    isAuthenticated: !!session,
  }
}
