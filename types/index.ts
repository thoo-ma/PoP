import type { Session, User } from '@supabase/supabase-js';

// Re-export Supabase types
export type { Session, User };

// Re-export navigation types
export * from './navigation';

// Re-export component types
export * from './components';

// Re-export sensor types
export * from './sensors';

// OAuth Types
export type OAuthProvider = 'google' | 'twitter';

// Difficulty Modes
export type DifficultyMode = 'easy' | 'normal' | 'strict';

// Auth Hook Return Type
export interface UseAuthReturn {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<{ error: Error | null }>;
  getUserDisplayName: () => string;
  user: User | null;
  isAuthenticated: boolean;
}
