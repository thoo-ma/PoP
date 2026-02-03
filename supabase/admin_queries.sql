-- ============================================================================
-- ADMIN SQL QUERIES FOR INVITE CODE MANAGEMENT
-- Run these queries in Supabase SQL Editor
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GENERATE INVITE CODES
-- ----------------------------------------------------------------------------

-- Generate a single invite code
SELECT generate_invite_codes(1);

-- Generate 10 invite codes at once
SELECT generate_invite_codes(10);

-- Generate 50 invite codes for a launch campaign
SELECT generate_invite_codes(50);

-- View the most recently generated codes
SELECT code, created_at 
FROM public.invite_codes 
WHERE used_by IS NULL 
ORDER BY created_at DESC 
LIMIT 10;


-- ----------------------------------------------------------------------------
-- 2. VIEW ALL CODES WITH STATUS
-- ----------------------------------------------------------------------------

-- View all codes with their usage status and user emails
SELECT 
  ic.code,
  ic.created_at,
  ic.revoked,
  ic.expires_at,
  ic.used_at,
  au.email as used_by_email,
  CASE 
    WHEN ic.revoked = TRUE THEN 'REVOKED'
    WHEN ic.used_by IS NOT NULL THEN 'USED'
    WHEN ic.expires_at IS NOT NULL AND ic.expires_at < NOW() THEN 'EXPIRED'
    ELSE 'AVAILABLE'
  END as status
FROM public.invite_codes ic
LEFT JOIN auth.users au ON ic.used_by = au.id
ORDER BY ic.created_at DESC;


-- View only AVAILABLE codes (ready to share)
SELECT 
  code,
  created_at,
  expires_at
FROM public.invite_codes
WHERE used_by IS NULL 
  AND revoked = FALSE
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC;


-- Count codes by status
SELECT 
  CASE 
    WHEN revoked = TRUE THEN 'REVOKED'
    WHEN used_by IS NOT NULL THEN 'USED'
    WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN 'EXPIRED'
    ELSE 'AVAILABLE'
  END as status,
  COUNT(*) as count
FROM public.invite_codes
GROUP BY status
ORDER BY count DESC;


-- ----------------------------------------------------------------------------
-- 3. VIEW USERS AND THEIR INVITE CODES
-- ----------------------------------------------------------------------------

-- View all users with their approval status and invite code
SELECT 
  u.id,
  au.email,
  u.approved,
  ic.code as invite_code_used,
  u.created_at as user_created_at,
  ic.used_at as code_used_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
LEFT JOIN public.invite_codes ic ON u.invite_code_id = ic.id
ORDER BY u.created_at DESC;


-- View approved users only
SELECT 
  au.email,
  ic.code as invite_code_used,
  u.created_at as joined_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
LEFT JOIN public.invite_codes ic ON u.invite_code_id = ic.id
WHERE u.approved = TRUE
ORDER BY u.created_at DESC;


-- View unapproved users (waiting for invite code)
SELECT 
  au.email,
  u.created_at as signed_up_at,
  NOW() - u.created_at as waiting_duration
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.approved = FALSE
ORDER BY u.created_at DESC;


-- ----------------------------------------------------------------------------
-- 4. REVOKE INVITE CODES
-- ----------------------------------------------------------------------------

-- Revoke a specific code (e.g., shared with wrong person)
UPDATE public.invite_codes
SET revoked = TRUE
WHERE code = 'ABC12XYZ';

-- Revoke multiple codes at once
UPDATE public.invite_codes
SET revoked = TRUE
WHERE code IN ('CODE0001', 'CODE0002', 'CODE0003');

-- Revoke all unused codes (e.g., end of campaign)
UPDATE public.invite_codes
SET revoked = TRUE
WHERE used_by IS NULL AND revoked = FALSE;


-- ----------------------------------------------------------------------------
-- 5. SET EXPIRATION DATES
-- ----------------------------------------------------------------------------

-- Set expiration date for a specific code (expires in 7 days)
UPDATE public.invite_codes
SET expires_at = NOW() + INTERVAL '7 days'
WHERE code = 'ABC12XYZ';

-- Set expiration for all unused codes (expires in 30 days)
UPDATE public.invite_codes
SET expires_at = NOW() + INTERVAL '30 days'
WHERE used_by IS NULL AND expires_at IS NULL;

-- Remove expiration from a code
UPDATE public.invite_codes
SET expires_at = NULL
WHERE code = 'ABC12XYZ';


-- ----------------------------------------------------------------------------
-- 6. MANUALLY APPROVE USERS (BYPASS INVITE CODE)
-- ----------------------------------------------------------------------------

-- Approve a user by email (emergency bypass)
UPDATE public.users u
SET approved = TRUE
FROM auth.users au
WHERE u.id = au.id AND au.email = 'user@example.com';

-- Approve a user by user ID
UPDATE public.users
SET approved = TRUE
WHERE id = '550e8400-e29b-41d4-a716-446655440000';


-- ----------------------------------------------------------------------------
-- 7. ANALYTICS AND STATISTICS
-- ----------------------------------------------------------------------------

-- Overall conversion rate (users who completed signup vs total users)
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE approved = TRUE) as approved_users,
  COUNT(*) FILTER (WHERE approved = FALSE) as unapproved_users,
  ROUND(100.0 * COUNT(*) FILTER (WHERE approved = TRUE) / COUNT(*), 2) as approval_rate_percent
FROM public.users;


-- Code usage statistics
SELECT 
  COUNT(*) as total_codes,
  COUNT(*) FILTER (WHERE used_by IS NOT NULL) as used_codes,
  COUNT(*) FILTER (WHERE revoked = TRUE) as revoked_codes,
  COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND expires_at < NOW()) as expired_codes,
  COUNT(*) FILTER (WHERE used_by IS NULL AND revoked = FALSE AND (expires_at IS NULL OR expires_at > NOW())) as available_codes,
  ROUND(100.0 * COUNT(*) FILTER (WHERE used_by IS NOT NULL) / COUNT(*), 2) as usage_rate_percent
FROM public.invite_codes;


-- Average time between user signup and code submission
SELECT 
  AVG(ic.used_at - u.created_at) as avg_time_to_code_submission,
  MIN(ic.used_at - u.created_at) as min_time,
  MAX(ic.used_at - u.created_at) as max_time
FROM public.users u
JOIN public.invite_codes ic ON u.invite_code_id = ic.id
WHERE u.approved = TRUE;


-- Recent signups and approvals (last 7 days)
SELECT 
  DATE(u.created_at) as date,
  COUNT(*) as signups,
  COUNT(*) FILTER (WHERE u.approved = TRUE) as approved,
  ROUND(100.0 * COUNT(*) FILTER (WHERE u.approved = TRUE) / COUNT(*), 2) as approval_rate
FROM public.users u
WHERE u.created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(u.created_at)
ORDER BY date DESC;


-- Top users who joined recently
SELECT 
  au.email,
  u.created_at as joined_at,
  ic.code as code_used,
  ic.used_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
LEFT JOIN public.invite_codes ic ON u.invite_code_id = ic.id
WHERE u.approved = TRUE
ORDER BY u.created_at DESC
LIMIT 20;


-- ----------------------------------------------------------------------------
-- 8. CLEANUP OPERATIONS
-- ----------------------------------------------------------------------------

-- Delete expired codes that were never used (cleanup old campaigns)
DELETE FROM public.invite_codes
WHERE used_by IS NULL 
  AND expires_at IS NOT NULL 
  AND expires_at < NOW() - INTERVAL '30 days';

-- Delete revoked codes that were never used (after grace period)
DELETE FROM public.invite_codes
WHERE used_by IS NULL 
  AND revoked = TRUE 
  AND created_at < NOW() - INTERVAL '90 days';


-- ----------------------------------------------------------------------------
-- 9. SEARCH AND FILTER OPERATIONS
-- ----------------------------------------------------------------------------

-- Find which user used a specific code
SELECT 
  au.email,
  u.approved,
  ic.code,
  ic.used_at
FROM public.invite_codes ic
JOIN public.users u ON ic.used_by = u.id
JOIN auth.users au ON u.id = au.id
WHERE ic.code = 'ABC12XYZ';


-- Find codes that will expire soon (within next 7 days)
SELECT 
  code,
  expires_at,
  expires_at - NOW() as time_until_expiry
FROM public.invite_codes
WHERE used_by IS NULL
  AND revoked = FALSE
  AND expires_at IS NOT NULL
  AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY expires_at ASC;


-- Find users who signed up but haven't entered code (abandoned signups)
SELECT 
  au.email,
  u.created_at,
  NOW() - u.created_at as time_since_signup
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.approved = FALSE
  AND u.created_at < NOW() - INTERVAL '1 day'
ORDER BY u.created_at ASC;


-- ----------------------------------------------------------------------------
-- 10. BATCH OPERATIONS
-- ----------------------------------------------------------------------------

-- Generate codes with custom pattern (optional - requires modification)
-- This creates codes with a specific prefix for tracking campaigns
INSERT INTO public.invite_codes (code)
SELECT 
  'CAMP' || upper(substring(md5(random()::text) from 1 for 4))
FROM generate_series(1, 20);


-- Export all available codes to CSV (copy results to spreadsheet)
SELECT code 
FROM public.invite_codes
WHERE used_by IS NULL 
  AND revoked = FALSE
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC;
