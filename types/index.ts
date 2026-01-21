import type { Session, User } from '@supabase/supabase-js';

// Re-export Supabase types for convenience
export type { Session, User };

// OAuth Providers
export type OAuthProvider = 'google' | 'twitter';

// Auth Hook Return Type
export interface UseAuthReturn {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<{ error: Error | null }>;
  getUserDisplayName: () => string;
  user: User | null;
  isAuthenticated: boolean;
}

// OAuth Button Props
export interface OAuthButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  loading: boolean;
}
