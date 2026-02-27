import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib';
import type { Session } from '@supabase/supabase-js';
import type { UseAuthReturn } from '@/types';

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen to authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error };
    }
    return { error: null };
  }, []);

  const getUserDisplayName = useCallback((): string => {
    return session?.user.email || session?.user.user_metadata?.name || 'User';
  }, [session]);

  return {
    session,
    loading,
    signOut,
    getUserDisplayName,
    user: session?.user ?? null,
    isAuthenticated: !!session,
  };
}
