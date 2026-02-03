-- Invite Code System Migration
-- Creates tables, functions, and triggers for mandatory invite code approval

-- ============================================================================
-- TABLE: invite_codes
-- Stores invite codes that users must submit after OAuth signup
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT code_format CHECK (code ~ '^[A-Z0-9]{8}$'),
  CONSTRAINT used_at_requires_used_by CHECK (
    (used_at IS NULL AND used_by IS NULL) OR 
    (used_at IS NOT NULL AND used_by IS NOT NULL)
  )
);

-- Index for fast code lookups
CREATE INDEX idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX idx_invite_codes_used_by ON public.invite_codes(used_by);

-- ============================================================================
-- TABLE: users
-- Extended user profile linked to auth.users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  invite_code_id UUID REFERENCES public.invite_codes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT approved_requires_code CHECK (
    (approved = FALSE) OR 
    (approved = TRUE AND invite_code_id IS NOT NULL)
  )
);

-- Index for fast approval lookups
CREATE INDEX idx_users_approved ON public.users(approved);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- invite_codes: Only accessible via SQL functions (service role)
CREATE POLICY "Service role can manage invite codes"
  ON public.invite_codes
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- users: Users can read their own row
CREATE POLICY "Users can read their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- users: Service role can manage all users
CREATE POLICY "Service role can manage users"
  ON public.users
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- ============================================================================
-- FUNCTION: generate_invite_codes
-- Generates N random 8-character alphanumeric invite codes
-- Usage: SELECT generate_invite_codes(10); -- generates 10 codes
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_invite_codes(p_count INT DEFAULT 1)
RETURNS TABLE(code TEXT) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.invite_codes (code)
  SELECT 
    upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8))
  FROM generate_series(1, p_count)
  RETURNING invite_codes.code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: validate_and_approve_user
-- Validates invite code and approves user if valid
-- Called from React Native app after user enters code
-- Returns JSON: {success: boolean, error: text}
-- ============================================================================
CREATE OR REPLACE FUNCTION public.validate_and_approve_user(p_code TEXT)
RETURNS JSON AS $$
DECLARE
  v_code_record RECORD;
  v_user_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check if user exists
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Check if user is already approved
  IF EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = v_user_id AND approved = TRUE
  ) THEN
    RETURN json_build_object(
      'success', TRUE,
      'error', NULL
    );
  END IF;
  
  -- Normalize code to uppercase
  p_code := upper(trim(p_code));
  
  -- Validate code format (8 alphanumeric characters)
  IF NOT (p_code ~ '^[A-Z0-9]{8}$') THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Invalid code format'
    );
  END IF;
  
  -- Fetch invite code
  SELECT * INTO v_code_record
  FROM public.invite_codes
  WHERE code = p_code;
  
  -- Check if code exists
  IF v_code_record IS NULL THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Invalid invite code'
    );
  END IF;
  
  -- Check if code is revoked
  IF v_code_record.revoked = TRUE THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'This invite code has been revoked'
    );
  END IF;
  
  -- Check if code is already used
  IF v_code_record.used_by IS NOT NULL THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'This invite code has already been used'
    );
  END IF;
  
  -- Check if code is expired
  IF v_code_record.expires_at IS NOT NULL AND v_code_record.expires_at < NOW() THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'This invite code has expired'
    );
  END IF;
  
  -- All validations passed - approve user and mark code as used
  BEGIN
    -- Update invite code
    UPDATE public.invite_codes
    SET 
      used_by = v_user_id,
      used_at = NOW()
    WHERE id = v_code_record.id;
    
    -- Update user
    UPDATE public.users
    SET 
      approved = TRUE,
      invite_code_id = v_code_record.id
    WHERE id = v_user_id;
    
    -- Return success
    RETURN json_build_object(
      'success', TRUE,
      'error', NULL
    );
  EXCEPTION
    WHEN OTHERS THEN
      RETURN json_build_object(
        'success', FALSE,
        'error', 'Failed to approve user: ' || SQLERRM
      );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: on_auth_user_created
-- Automatically creates user record when new auth.users row is created
-- Sets approved=false so user must enter invite code
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, approved)
  VALUES (NEW.id, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permission on functions to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_and_approve_user(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_invite_codes(INT) TO service_role;

COMMENT ON TABLE public.invite_codes IS 'Stores invite codes for user approval system';
COMMENT ON TABLE public.users IS 'Extended user profiles with approval status';
COMMENT ON FUNCTION public.generate_invite_codes(INT) IS 'Generates N random invite codes for admin distribution';
COMMENT ON FUNCTION public.validate_and_approve_user(TEXT) IS 'Validates invite code and approves user if valid';
