-- ============================================================================
-- AUTO-SEED TEST NFTs FOR ANONYMOUS USERS (Dev Mode)
-- Provides RPC function to seed 50 test NFTs for development/testing
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
  
  -- ========== CRUISE-SEAT TIER (NFTs 1-15) ==========
  
  -- Ancient Egyptian variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Ancient Egyptian Toilet', 'cruise-seat'::nft_tier, 'ancient-egyptian', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/ancient-egyptian/ancient-egyptian-common.jpg', 55, 60, 58, 62, 100, 1),
    (v_user_id, 'Ancient Egyptian Toilet', 'cruise-seat'::nft_tier, 'ancient-egyptian', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/ancient-egyptian/ancient-egyptian-rare.jpg', 65, 70, 68, 72, 85, 3),
    (v_user_id, 'Ancient Egyptian Toilet', 'cruise-seat'::nft_tier, 'ancient-egyptian', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/ancient-egyptian/ancient-egyptian-legendary.jpg', 75, 80, 78, 82, 60, 8);
  
  -- Ancient Maya Stone variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Ancient Maya Stone Toilet', 'cruise-seat'::nft_tier, 'ancient-maya-stone', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/ancient-maya-stone/ancient-maya-stone-common.jpg', 58, 62, 55, 60, 95, 2),
    (v_user_id, 'Ancient Maya Stone Toilet', 'cruise-seat'::nft_tier, 'ancient-maya-stone', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/ancient-maya-stone/ancient-maya-stone-rare.jpg', 68, 72, 65, 70, 75, 5),
    (v_user_id, 'Ancient Maya Stone Toilet', 'cruise-seat'::nft_tier, 'ancient-maya-stone', 'transcendent'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/ancient-maya-stone/ancient-maya-stone-transcendent.jpg', 85, 88, 82, 90, 100, 15);
  
  -- Medieval Castle Garderobe variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Medieval Castle Garderobe Toilet', 'cruise-seat'::nft_tier, 'medieval-castle-garderobe', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/medieval-castle-garderobe/medieval-castle-garderobe-common.jpg', 52, 58, 60, 65, 50, 1),
    (v_user_id, 'Medieval Castle Garderobe Toilet', 'cruise-seat'::nft_tier, 'medieval-castle-garderobe', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/medieval-castle-garderobe/medieval-castle-garderobe-rare.jpg', 62, 68, 70, 75, 20, 4),
    (v_user_id, 'Medieval Castle Garderobe Toilet', 'cruise-seat'::nft_tier, 'medieval-castle-garderobe', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/medieval-castle-garderobe/medieval-castle-garderobe-legendary.jpg', 72, 78, 80, 85, 100, 10);
  
  -- Prehistoric Stone variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Prehistoric Stone Toilet', 'cruise-seat'::nft_tier, 'prehistoric-stone', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/prehistoric-stone/prehistoric-stone-common.jpg', 60, 65, 70, 75, 100, 1),
    (v_user_id, 'Prehistoric Stone Toilet', 'cruise-seat'::nft_tier, 'prehistoric-stone', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/prehistoric-stone/prehistoric-stone-rare.jpg', 70, 75, 80, 85, 65, 6),
    (v_user_id, 'Prehistoric Stone Toilet', 'cruise-seat'::nft_tier, 'prehistoric-stone', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/prehistoric-stone/prehistoric-stone-legendary.jpg', 78, 82, 88, 90, 30, 11);
  
  -- Victorian Era Wooden Throne variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Victorian Era Wooden Throne Toilet', 'cruise-seat'::nft_tier, 'victorian-era-wooden-throne', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/victorian-era-wooden-throne/victorian-era-wooden-throne-common.jpg', 56, 60, 64, 68, 80, 2),
    (v_user_id, 'Victorian Era Wooden Throne Toilet', 'cruise-seat'::nft_tier, 'victorian-era-wooden-throne', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/victorian-era-wooden-throne/victorian-era-wooden-throne-rare.jpg', 66, 70, 74, 78, 45, 7),
    (v_user_id, 'Victorian Era Wooden Throne Toilet', 'cruise-seat'::nft_tier, 'victorian-era-wooden-throne', 'transcendent'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/cruise-seat/victorian-era-wooden-throne/victorian-era-wooden-throne-transcendent.jpg', 82, 86, 90, 92, 100, 18);
  
  -- ========== TURBO-FLUSH TIER (NFTs 16-33) ==========
  
  -- Astronaut Zero Gravity variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Astronaut Zero Gravity Toilet', 'turbo-flush'::nft_tier, 'astronaut-zero-gravity', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/astronaut-zero-gravity/astronaut-zero-gravity-common.jpg', 72, 75, 70, 68, 100, 3),
    (v_user_id, 'Astronaut Zero Gravity Toilet', 'turbo-flush'::nft_tier, 'astronaut-zero-gravity', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/astronaut-zero-gravity/astronaut-zero-gravity-rare.jpg', 80, 82, 78, 75, 70, 8),
    (v_user_id, 'Astronaut Zero Gravity Toilet', 'turbo-flush'::nft_tier, 'astronaut-zero-gravity', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/astronaut-zero-gravity/astronaut-zero-gravity-legendary.jpg', 88, 90, 86, 82, 40, 13);
  
  -- Portable Construction Site Cabin variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Portable Construction Site Cabin Toilet', 'turbo-flush'::nft_tier, 'portable-construction-site-cabin', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/portable-construction-site-cabin/portable-construction-site-cabin-common.jpg', 70, 78, 65, 62, 90, 2),
    (v_user_id, 'Portable Construction Site Cabin Toilet', 'turbo-flush'::nft_tier, 'portable-construction-site-cabin', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/portable-construction-site-cabin/portable-construction-site-cabin-rare.jpg', 78, 85, 72, 70, 55, 6),
    (v_user_id, 'Portable Construction Site Cabin Toilet', 'turbo-flush'::nft_tier, 'portable-construction-site-cabin', 'transcendent'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/portable-construction-site-cabin/portable-construction-site-cabin-transcendent.jpg', 90, 95, 85, 88, 100, 19);
  
  -- Prehistoric Sanitation variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Prehistoric Sanitation Toilet', 'turbo-flush'::nft_tier, 'prehistoric-sanitation', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/prehistoric-sanitation/prehistoric-sanitation-common.jpg', 68, 72, 68, 65, 85, 1),
    (v_user_id, 'Prehistoric Sanitation Toilet', 'turbo-flush'::nft_tier, 'prehistoric-sanitation', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/prehistoric-sanitation/prehistoric-sanitation-rare.jpg', 76, 80, 76, 72, 50, 5),
    (v_user_id, 'Prehistoric Sanitation Toilet', 'turbo-flush'::nft_tier, 'prehistoric-sanitation', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/prehistoric-sanitation/prehistoric-sanitation-legendary.jpg', 84, 88, 84, 80, 25, 12);
  
  -- Roman Public Latrines variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Roman Public Latrines Toilet', 'turbo-flush'::nft_tier, 'roman-public-latrines', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/roman-public-latrines/roman-public-latrines-common.jpg', 74, 76, 70, 68, 95, 4),
    (v_user_id, 'Roman Public Latrines Toilet', 'turbo-flush'::nft_tier, 'roman-public-latrines', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/roman-public-latrines/roman-public-latrines-rare.jpg', 82, 84, 78, 76, 60, 9),
    (v_user_id, 'Roman Public Latrines Toilet', 'turbo-flush'::nft_tier, 'roman-public-latrines', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/roman-public-latrines/roman-public-latrines-legendary.jpg', 90, 92, 86, 84, 15, 14);
  
  -- Rustic Forest Outhouse variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Rustic Forest Outhouse Toilet', 'turbo-flush'::nft_tier, 'rustic-forest-outhouse', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/rustic-forest-outhouse/rustic-forest-outhouse-common.jpg', 78, 85, 82, 70, 85, 5),
    (v_user_id, 'Rustic Forest Outhouse Toilet', 'turbo-flush'::nft_tier, 'rustic-forest-outhouse', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/rustic-forest-outhouse/rustic-forest-outhouse-rare.jpg', 84, 90, 88, 78, 35, 10),
    (v_user_id, 'Rustic Forest Outhouse Toilet', 'turbo-flush'::nft_tier, 'rustic-forest-outhouse', 'transcendent'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/rustic-forest-outhouse/rustic-forest-outhouse-transcendent.jpg', 92, 96, 94, 90, 100, 20);
  
  -- Squat variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Squat Toilet', 'turbo-flush'::nft_tier, 'squat', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/squat/squat-common.jpg', 75, 78, 80, 65, 20, 3),
    (v_user_id, 'Squat Toilet', 'turbo-flush'::nft_tier, 'squat', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/squat/squat-rare.jpg', 82, 85, 86, 72, 0, 7),
    (v_user_id, 'Squat Toilet', 'turbo-flush'::nft_tier, 'squat', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/turbo-flush/squat/squat-legendary.jpg', 89, 92, 92, 80, 75, 16);
  
  -- ========== ZEN-FORTRESS TIER (NFTs 34-50) ==========
  
  -- Cyberpunk Dystopian variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Cyberpunk Dystopian Toilet', 'zen-fortress'::nft_tier, 'cyberpunk-dystopian', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/cyberpunk-dystopian/cyberpunk-dystopian-common.jpg', 82, 85, 80, 78, 100, 5),
    (v_user_id, 'Cyberpunk Dystopian Toilet', 'zen-fortress'::nft_tier, 'cyberpunk-dystopian', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/cyberpunk-dystopian/cyberpunk-dystopian-rare.jpg', 88, 90, 86, 84, 80, 11),
    (v_user_id, 'Cyberpunk Dystopian Toilet', 'zen-fortress'::nft_tier, 'cyberpunk-dystopian', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/cyberpunk-dystopian/cyberpunk-dystopian-legendary.jpg', 94, 96, 92, 90, 50, 17),
    (v_user_id, 'Cyberpunk Dystopian Toilet', 'zen-fortress'::nft_tier, 'cyberpunk-dystopian', 'transcendent'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/cyberpunk-dystopian/cyberpunk-dystopian-transcendent.jpg', 98, 100, 96, 95, 100, 20);
  
  -- Dubai variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Dubai Toilet', 'zen-fortress'::nft_tier, 'dubai', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/dubai/dubai-common.jpg', 84, 86, 82, 80, 90, 6),
    (v_user_id, 'Dubai Toilet', 'zen-fortress'::nft_tier, 'dubai', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/dubai/dubai-rare.jpg', 88, 92, 85, 90, 90, 12),
    (v_user_id, 'Dubai Toilet', 'zen-fortress'::nft_tier, 'dubai', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/dubai/dubai-legendary.jpg', 92, 96, 90, 94, 40, 15);
  
  -- Eco-Friendly variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Eco Friendly Toilet', 'zen-fortress'::nft_tier, 'eco-friendly', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/eco-friendly/eco-friendly-common.jpg', 80, 82, 85, 82, 70, 4),
    (v_user_id, 'Eco Friendly Toilet', 'zen-fortress'::nft_tier, 'eco-friendly', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/eco-friendly/eco-friendly-rare.jpg', 85, 88, 88, 82, 75, 8),
    (v_user_id, 'Eco Friendly Toilet', 'zen-fortress'::nft_tier, 'eco-friendly', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/eco-friendly/eco-friendly-legendary.jpg', 90, 92, 92, 88, 10, 13),
    (v_user_id, 'Eco Friendly Toilet', 'zen-fortress'::nft_tier, 'eco-friendly', 'transcendent'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/eco-friendly/eco-friendly-transcendent.jpg', 96, 98, 98, 94, 100, 19);
  
  -- Futuristic Sci-Fi Vacuum variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Futuristic Sci Fi Vacuum Toilet', 'zen-fortress'::nft_tier, 'futuristic-sci-fi-vacuum', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/futuristic-sci-fi-vacuum/futuristic-sci-fi-vacuum-common.jpg', 86, 88, 84, 82, 100, 7),
    (v_user_id, 'Futuristic Sci Fi Vacuum Toilet', 'zen-fortress'::nft_tier, 'futuristic-sci-fi-vacuum', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/futuristic-sci-fi-vacuum/futuristic-sci-fi-vacuum-rare.jpg', 90, 92, 88, 86, 65, 10),
    (v_user_id, 'Futuristic Sci Fi Vacuum Toilet', 'zen-fortress'::nft_tier, 'futuristic-sci-fi-vacuum', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/futuristic-sci-fi-vacuum/futuristic-sci-fi-vacuum-legendary.jpg', 95, 100, 92, 88, 100, 20);
  
  -- Renaissance Chaise variants
  INSERT INTO public.nfts (user_id, name, tier, variant, rarity, image_url, efficiency, resilience, comfort, luck, energy, level)
  VALUES 
    (v_user_id, 'Renaissance Chaise Toilet', 'zen-fortress'::nft_tier, 'renaissance-chaise', 'common'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/renaissance-chaise/renaissance-chaise-common.jpg', 83, 85, 88, 80, 55, 5),
    (v_user_id, 'Renaissance Chaise Toilet', 'zen-fortress'::nft_tier, 'renaissance-chaise', 'rare'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/renaissance-chaise/renaissance-chaise-rare.jpg', 87, 89, 92, 85, 30, 9),
    (v_user_id, 'Renaissance Chaise Toilet', 'zen-fortress'::nft_tier, 'renaissance-chaise', 'legendary'::nft_rarity, v_supabase_url || '/storage/v1/object/public/assets/toilets/zen-fortress/renaissance-chaise/renaissance-chaise-legendary.jpg', 91, 93, 95, 90, 5, 14);
  
  RETURN json_build_object(
    'success', TRUE,
    'message', 'Successfully created 50 test NFTs',
    'nft_count', 50
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

COMMENT ON FUNCTION public.seed_dev_test_nfts() IS 'Seeds 50 test NFTs for current user (dev/testing only)';
