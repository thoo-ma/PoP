-- ============================================================================
-- DEV TEST NFT SEED
-- Quick seed for development: adds 6 NFTs to the current authenticated user
-- Run this in Supabase SQL Editor while authenticated as your test user
-- ============================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT := 'dev@test.com';  -- CHANGE THIS TO YOUR DEV EMAIL
  v_supabase_url TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co';
BEGIN
  -- Get user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_user_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Please update v_user_email in the script.', v_user_email;
  END IF;
  
  RAISE NOTICE 'Adding test NFTs for user: % (%)', v_user_email, v_user_id;
  
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
  
  RAISE NOTICE '✅ Successfully added 6 test NFTs!';
  
END $$;

-- View your new NFTs (replace 'dev@test.com' with your email)
SELECT 
  n.id,
  n.name,
  n.tier,
  n.rarity,
  n.level,
  n.energy,
  n.efficiency,
  n.resilience,
  n.comfort,
  n.luck
FROM public.nfts n
JOIN auth.users u ON n.user_id = u.id
WHERE u.email = 'dev@test.com'  -- CHANGE THIS TO YOUR DEV EMAIL
ORDER BY n.created_at DESC;
