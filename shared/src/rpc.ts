/**
 * RPC contracts shared between the database (Supabase functions / RPCs) and clients.
 */

/**
 * Result returned by the `validate_and_approve_user` Postgres RPC.
 */
export interface ApprovalResult {
  success: boolean
  error: string | null
}
