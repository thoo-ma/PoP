import { supabase } from "./supabase";
import type { ApprovalResult } from "@/types/auth";

/**
 * Validates an invite code and approves the current user.
 */
export async function validateInviteCode(code: string): Promise<ApprovalResult> {
  const { data, error } = await supabase.rpc("validate_and_approve_user", {
    p_code: code,
  });

  if (error) {
    throw error;
  }

  if (
    data === null ||
    data === undefined ||
    typeof (data as Record<string, unknown>).success !== "boolean"
  ) {
    throw new Error("Unexpected response shape from validate_and_approve_user RPC");
  }

  return data as unknown as ApprovalResult;
}
