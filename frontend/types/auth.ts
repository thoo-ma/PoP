import type { Session, User } from '@supabase/supabase-js';
import type { Tables } from '@pop/shared';

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

/** Row type for public.users — derived from generated DB types. */
export type UserProfile = Tables<'users'>;

/** Row type for public.invite_codes — derived from generated DB types. */
export type InviteCode = Tables<'invite_codes'>;

/**
 * Result from validate_and_approve_user RPC function
 */
export interface ApprovalResult {
  success: boolean;
  error: string | null;
}

/**
 * Return type for useUserApproval hook
 */
export interface UseUserApprovalReturn {
  approved: boolean | null;
  loading: boolean;
  refetch: () => Promise<void>;
}
