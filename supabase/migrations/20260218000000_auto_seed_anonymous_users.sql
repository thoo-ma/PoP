-- ============================================================================
-- AUTO-SEED TEST NFTs FOR ANONYMOUS USERS (Dev Mode)
-- Provides RPC function to seed test NFTs for development/testing
-- ============================================================================

-- Function to seed test NFTs for current authenticated user
CREATE OR REPLACE FUNCTION public.seed_dev_test_nfts()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_supabase_url TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co';
  v_nft_count INTEGER;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Check if user already has NFTs
  SELECT COUNT(*) INTO v_nft_count
  FROM public.nfts 
  WHERE user_id = v_user_id;
  
  IF v_nft_count > 0 THEN
    RETURN json_build_object(
      'success', TRUE,
      'message', 'User already has NFTs',
      'nft_count', v_nft_count
    );
  END IF;
  
  -- NFT #1: Basic cruise-seat (starter tier)
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES (
    v_user_id,
    'Prehistoric Throne',
    'cruise-seat'::nft_tier,
    'prehistoric-stone',
    'common'::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/prehistoric-stone/prehistoric-stone-common.jpg',
    60, 65, 70, 75, 100, 1
  );
  
  -- NFT #2: Mid-tier turbo-flush
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES (
    v_user_id,
    'Forest Outhouse',
    'turbo-flush'::nft_tier,
    'rustic-forest-outhouse',
    'common'::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/rustic-forest-outhouse/rustic-forest-outhouse-common.jpg',
    78, 85, 82, 70, 85, 5
  );
  
  -- NFT #3: High-tier zen-fortress (rare)
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES (
    v_user_id,
    'Dubai Luxury Suite',
    'zen-fortress'::nft_tier,
    'dubai',
    'rare'::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/dubai/dubai-rare.jpg',
    88, 92, 85, 90, 90, 12
  );
  
  -- NFT #4: Low energy turbo-flush (for repair testing)
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES (
    v_user_id,
    'Classic Squat',
    'turbo-flush'::nft_tier,
    'squat',
    'common'::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/squat/squat-common.jpg',
    75, 78, 80, 65, 20, 3
  );
  
  -- NFT #5: Legendary zen-fortress (max level for testing)
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES (
    v_user_id,
    'Futuristic Vacuum Toilet',
    'zen-fortress'::nft_tier,
    'futuristic-sci-fi-vacuum',
    'legendary'::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/futuristic-sci-fi-vacuum/futuristic-sci-fi-vacuum-legendary.jpg',
    95, 100, 92, 88, 100, 20
  );
  
  -- NFT #6: Eco-friendly zen-fortress (for marketplace testing)
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES (
    v_user_id,
    'Eco-Friendly Composting Throne',
    'zen-fortress'::nft_tier,
    'eco-friendly',
    'rare'::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/eco-friendly/eco-friendly-rare.jpg',
    85, 88, 88, 82, 75, 8
  );
  
  RETURN json_build_object(
    'success', TRUE,
    'message', 'Successfully created 6 test NFTs',
    'nft_count', 6
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Failed to create NFTs: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.seed_dev_test_nfts() TO authenticated;

COMMENT ON FUNCTION public.seed_dev_test_nfts() IS 'Seeds 6 test NFTs for current user (dev/testing only)';
