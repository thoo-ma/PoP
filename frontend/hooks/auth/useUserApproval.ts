import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logError } from '@/utils/errorHelpers'

/**
 * Return type for {@link useUserApproval}.
 */
export interface UseUserApprovalReturn {
  approved: boolean | null
  loading: boolean
  refetch: () => Promise<void>
}

/**
 * Hook to manage user approval status.
 *
 * Queries `public.users` to check whether the current user has been approved.
 * Returns `null` for `approved` while the user row is still being created by
 * the database trigger (brief window after first sign-in).
 *
 * @param session - Current Supabase session; re-triggers the approval check
 *   whenever the session changes.
 * @returns Approval state (`approved`, `loading`) and a `checkApproval` callback
 *   to manually re-trigger the fetch.
 */
export function useUserApproval(session?: Session | null): UseUserApprovalReturn {
  const [approved, setApproved] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchApprovalStatus = useCallback(async () => {
    try {
      setLoading(true)

      // Get current user from cached session (no network round-trip)
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession()

      if (!authSession?.user) {
        setApproved(null)
        setLoading(false)
        return
      }

      // Query user approval status
      const { data, error } = await supabase
        .from('users')
        .select('approved')
        .eq('id', authSession.user.id)
        .single()

      if (error) {
        // User might not exist yet (trigger still processing)
        if (error.code === 'PGRST116') {
          setApproved(null)
        } else {
          logError('UserApproval:Fetch', error)
          setApproved(null)
        }
      } else {
        setApproved(data?.approved ?? null)
      }
    } catch (error) {
      logError('UserApproval:Fetch', error)
      setApproved(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchApprovalStatus()
  }, [fetchApprovalStatus])

  useEffect(() => {
    if (!session) {
      setApproved(null)
      setLoading(false)
      return
    }
    fetchApprovalStatus()

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchApprovalStatus()
      } else if (event === 'SIGNED_OUT') {
        setApproved(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [session, fetchApprovalStatus])

  return { approved, loading, refetch }
}
