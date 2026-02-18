-- Add starter NFT assignment when user is approved
-- Modifies the validate_and_approve_user function to create a random cruise-seat-tier NFT

-- Drop existing function
DROP FUNCTION IF EXISTS public.validate_and_approve_user(TEXT);

-- Recreate with starter NFT creation
CREATE OR REPLACE FUNCTION public.validate_and_approve_user(p_code TEXT)
RETURNS JSON AS $$
DECLARE
  v_code_record RECORD;
  v_user_id UUID;
  v_cruise_seat_variants TEXT[] := ARRAY['ancient-egyptian', 'ancient-maya-stone', 'medieval-castle-garderobe', 'prehistoric-stone', 'victorian-era-wooden-throne'];
  v_random_variant TEXT;
  v_image_url TEXT;
  v_supabase_url TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co';
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
    
    -- Generate starter NFT: random cruise-seat variant with common rarity
    v_random_variant := v_cruise_seat_variants[floor(random() * array_length(v_cruise_seat_variants, 1) + 1)::INTEGER];
    v_image_url := v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/' || v_random_variant || '/' || v_random_variant || '-common.jpg';
    
    -- Insert starter NFT for the new user
    INSERT INTO public.nfts (
      user_id,
      name,
      tier,
      variant,
      rarity,
      image_url,
      efficiency,
      resilience,
      comfort,
      luck,
      energy,
      level
    ) VALUES (
      v_user_id,
      'Starter Toilet',
      'cruise-seat'::nft_tier,
      v_random_variant,
      'common'::nft_rarity,
      v_image_url,
      60,  -- Base efficiency
      65,  -- Base resilience
      55,  -- Base comfort
      58,  -- Base luck
      100, -- Full energy
      1    -- Level 1
    );
    
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_and_approve_user(TEXT) TO authenticated;

COMMENT ON FUNCTION public.validate_and_approve_user(TEXT) IS 'Validates invite code, approves user, and creates starter cruise-seat tier NFT';
