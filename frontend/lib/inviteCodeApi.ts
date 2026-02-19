import { supabase } from './supabase';
import type { ApprovalResult } from '../types/auth';

/**
 * Validates an invite code and approves the current user.
 */
export async function validateInviteCode(code: string): Promise<ApprovalResult> {
  const { data, error } = await supabase.rpc('validate_and_approve_user', {
    p_code: code,
  });

  if (error) {
    throw error;
  }

  return data as ApprovalResult;
}
