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

// Immobility Challenge Types
export type DifficultyMode = 'easy' | 'normal' | 'strict';

export interface SensorThresholds {
  MOVEMENT_THRESHOLD: number;
  ROTATION_THRESHOLD: number;
  STEP_COOLDOWN: number;
  GRACE_PERIOD: number;
  WARNING_COOLDOWN: number;
}
