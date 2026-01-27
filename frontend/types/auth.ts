import type { Session, User } from '@supabase/supabase-js';

// Re-export Supabase types
export type { Session, User };

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'twitter';

/**
 * Return type for useAuth hook
 */
export interface UseAuthReturn {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<{ error: Error | null }>;
  getUserDisplayName: () => string;
  user: User | null;
  isAuthenticated: boolean;
}
