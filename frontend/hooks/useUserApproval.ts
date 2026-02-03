import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { UseUserApprovalReturn } from '../types/auth';

/**
 * Hook to manage user approval status
 * Queries public.users table to check if current user is approved
 * Returns null for approved if user not found (still being created by trigger)
 */
export function useUserApproval(): UseUserApprovalReturn {
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApprovalStatus = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setApproved(null);
        setLoading(false);
        return;
      }

      // Query user approval status
      const { data, error } = await supabase
        .from('users')
        .select('approved')
        .eq('id', user.id)
        .single();

      if (error) {
        // User might not exist yet (trigger still processing)
        if (error.code === 'PGRST116') {
          setApproved(null);
        } else {
          console.error('Error fetching approval status:', error);
          setApproved(null);
        }
      } else {
        setApproved(data?.approved ?? null);
      }
    } catch (error) {
      console.error('Error in fetchApprovalStatus:', error);
      setApproved(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchApprovalStatus();
  }, [fetchApprovalStatus]);

  useEffect(() => {
    fetchApprovalStatus();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchApprovalStatus();
      } else if (event === 'SIGNED_OUT') {
        setApproved(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchApprovalStatus]);

  return { approved, loading, refetch };
}
