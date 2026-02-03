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

/**
 * Extended user profile from public.users table
 */
export interface UserProfile {
  id: string;
  approved: boolean;
  invite_code_id: string | null;
  created_at: string;
}

/**
 * Invite code from public.invite_codes table
 */
export interface InviteCode {
  id: string;
  code: string;
  used_by: string | null;
  created_at: string;
  used_at: string | null;
  revoked: boolean;
  expires_at: string | null;
}

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
