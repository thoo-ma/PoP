-- ============================================================================
-- Guard seed_dev_test_nfts: revoke all client access (Fixes #92)
--
-- The RPC was previously GRANT'd to both `anon` and `authenticated`.
-- Because it is SECURITY DEFINER, any caller with either role could invoke it
-- directly without the (client-side-only) password check.
--
-- After this migration:
-- 1. Neither anon nor authenticated can call the function directly
-- 2. The function accepts a p_user_id parameter so the Edge Function
--    (which uses service_role) can pass the authenticated user's ID
-- ============================================================================

-- ── Revoke client-facing access ─────────────────────────────────────────────
REVOKE EXECUTE ON FUNCTION public.seed_dev_test_nfts() FROM anon;
REVOKE EXECUTE ON FUNCTION public.seed_dev_test_nfts() FROM authenticated;

-- ── Replace function to accept explicit user ID ─────────────────────────────
-- service_role has no auth.uid(), so the Edge Function passes the verified user ID.
DROP FUNCTION IF EXISTS public.seed_dev_test_nfts();

CREATE FUNCTION public.seed_dev_test_nfts(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_supabase_url TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co';
  v_box_base     TEXT;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Missing user ID');
  END IF;

  v_box_base := v_supabase_url || '/storage/v1/object/public/assets/mystery-boxes/';

  -- Clear existing data for this user
  DELETE FROM public.marketplace_listings WHERE seller_id = p_user_id;
  DELETE FROM public.nfts                 WHERE user_id   = p_user_id;
  DELETE FROM public.mystery_boxes        WHERE user_id   = p_user_id;

  -- ── TOILET NFTs (50) ──────────────────────────────────────────────────────
  INSERT INTO public.nfts
    (user_id, type, name, rarity, image_url, efficiency, resilience, comfort, luck, energy, level, xp)
  SELECT
    p_user_id,
    v.nft_type::nft_type,
    v.nft_name,
    v.nft_rarity::nft_rarity,
    v_supabase_url || '/storage/v1/object/public/assets/toilets/'
      || v.nft_type || '/' || v.nft_name || '/' || v.nft_name || '-' || v.nft_rarity || '.jpg',
    v.eff, v.res, v.com, v.lck, v.nrg,
    d.lv, d.xp_rem
  FROM (VALUES
    ('cruise-seat', 'ancient-egyptian',              'common',        55, 60, 58, 62, 100,   16),
    ('cruise-seat', 'ancient-egyptian',              'rare',          65, 70, 68, 72,  85,   90),
    ('cruise-seat', 'ancient-egyptian',              'legendary',     75, 80, 78, 82,  60,  403),
    ('cruise-seat', 'ancient-maya-stone',            'common',        58, 62, 55, 60,  95,   51),
    ('cruise-seat', 'ancient-maya-stone',            'rare',          68, 72, 65, 70,  75,  191),
    ('cruise-seat', 'ancient-maya-stone',            'transcendent',  85, 88, 82, 90, 100, 1267),
    ('cruise-seat', 'medieval-castle-garderobe',     'common',        52, 58, 60, 65,  50,   16),
    ('cruise-seat', 'medieval-castle-garderobe',     'rare',          62, 68, 70, 75,  20,  137),
    ('cruise-seat', 'medieval-castle-garderobe',     'legendary',     72, 78, 80, 85, 100,  591),
    ('cruise-seat', 'prehistoric-stone',             'common',        60, 65, 70, 75, 100,   16),
    ('cruise-seat', 'prehistoric-stone',             'rare',          70, 75, 80, 85,  65,  253),
    ('cruise-seat', 'prehistoric-stone',             'legendary',     78, 82, 88, 90,  30,  702),
    ('cruise-seat', 'victorian-era-wooden-throne',   'common',        56, 60, 64, 68,  80,   51),
    ('cruise-seat', 'victorian-era-wooden-throne',   'rare',          66, 70, 74, 78,  45,  323),
    ('cruise-seat', 'victorian-era-wooden-throne',   'transcendent',  82, 86, 90, 92, 100, 1836),
    ('turbo-flush', 'astronaut-zero-gravity',              'common',       72, 75, 70, 68, 100,   90),
    ('turbo-flush', 'astronaut-zero-gravity',              'rare',         80, 82, 78, 75,  70,  403),
    ('turbo-flush', 'astronaut-zero-gravity',              'legendary',    88, 90, 86, 82,  40,  958),
    ('turbo-flush', 'portable-construction-site-cabin',    'common',       70, 78, 65, 62,  90,   51),
    ('turbo-flush', 'portable-construction-site-cabin',    'rare',         78, 85, 72, 70,  55,  253),
    ('turbo-flush', 'portable-construction-site-cabin',    'transcendent', 90, 95, 85, 88, 100, 2056),
    ('turbo-flush', 'prehistoric-sanitation',              'common',       68, 72, 68, 65,  85,   16),
    ('turbo-flush', 'prehistoric-sanitation',              'rare',         76, 80, 76, 72,  50,  191),
    ('turbo-flush', 'prehistoric-sanitation',              'legendary',    84, 88, 84, 80,  25,  824),
    ('turbo-flush', 'roman-public-latrines',               'common',       74, 76, 70, 68,  95,  137),
    ('turbo-flush', 'roman-public-latrines',               'rare',         82, 84, 78, 76,  60,  492),
    ('turbo-flush', 'roman-public-latrines',               'legendary',    90, 92, 86, 84,  15, 1106),
    ('turbo-flush', 'rustic-forest-outhouse',              'common',       78, 85, 82, 70,  85,  191),
    ('turbo-flush', 'rustic-forest-outhouse',              'rare',         84, 90, 88, 78,  35,  591),
    ('turbo-flush', 'rustic-forest-outhouse',              'transcendent', 92, 96, 94, 90, 100, 2292),
    ('turbo-flush', 'squat',                               'common',       75, 78, 80, 65,  20,   90),
    ('turbo-flush', 'squat',                               'rare',         82, 85, 86, 72,   0,  323),
    ('turbo-flush', 'squat',                               'legendary',    89, 92, 92, 80,  75, 1442),
    ('zen-fortress', 'cyberpunk-dystopian',        'common',        82,  85, 80, 78, 100,  191),
    ('zen-fortress', 'cyberpunk-dystopian',        'rare',          88,  90, 86, 84,  80,  702),
    ('zen-fortress', 'cyberpunk-dystopian',        'legendary',     94,  96, 92, 90,  50, 1631),
    ('zen-fortress', 'cyberpunk-dystopian',        'transcendent',  98, 100, 96, 95, 100, 2292),
    ('zen-fortress', 'dubai',                      'common',        84,  86, 82, 80,  90,  253),
    ('zen-fortress', 'dubai',                      'rare',          88,  92, 85, 90,  90,  824),
    ('zen-fortress', 'dubai',                      'legendary',     92,  96, 90, 94,  40, 1267),
    ('zen-fortress', 'eco-friendly',               'common',        80,  82, 85, 82,  70,  137),
    ('zen-fortress', 'eco-friendly',               'rare',          85,  88, 88, 82,  75,  403),
    ('zen-fortress', 'eco-friendly',               'legendary',     90,  92, 92, 88,  10,  958),
    ('zen-fortress', 'eco-friendly',               'transcendent',  96,  98, 98, 94, 100, 2056),
    ('zen-fortress', 'futuristic-sci-fi-vacuum',   'common',        86,  88, 84, 82, 100,  323),
    ('zen-fortress', 'futuristic-sci-fi-vacuum',   'rare',          90,  92, 88, 86,  65,  591),
    ('zen-fortress', 'futuristic-sci-fi-vacuum',   'legendary',     95, 100, 92, 88, 100, 2292),
    ('zen-fortress', 'renaissance-chaise',         'common',        83,  85, 88, 80,  55,  191),
    ('zen-fortress', 'renaissance-chaise',         'rare',          87,  89, 92, 85,  30,  492),
    ('zen-fortress', 'renaissance-chaise',         'legendary',     91,  93, 95, 90,   5, 1106)
  ) AS v(nft_type, nft_name, nft_rarity, eff, res, com, lck, nrg, total_xp)
  CROSS JOIN LATERAL _xp_decompose(v.total_xp::INTEGER) d;

  -- ── MYSTERY BOXES (10) ────────────────────────────────────────────────────
  INSERT INTO public.mystery_boxes (user_id, rarity, image_url)
  VALUES
    (p_user_id, 'common'::nft_rarity,       v_box_base || 'common.jpg'),
    (p_user_id, 'common'::nft_rarity,       v_box_base || 'common.jpg'),
    (p_user_id, 'common'::nft_rarity,       v_box_base || 'common.jpg'),
    (p_user_id, 'common'::nft_rarity,       v_box_base || 'common.jpg'),
    (p_user_id, 'rare'::nft_rarity,         v_box_base || 'rare.jpg'),
    (p_user_id, 'rare'::nft_rarity,         v_box_base || 'rare.jpg'),
    (p_user_id, 'rare'::nft_rarity,         v_box_base || 'rare.jpg'),
    (p_user_id, 'legendary'::nft_rarity,    v_box_base || 'legendary.jpg'),
    (p_user_id, 'legendary'::nft_rarity,    v_box_base || 'legendary.jpg'),
    (p_user_id, 'transcendent'::nft_rarity, v_box_base || 'transcendent.jpg');

  RETURN json_build_object('success', TRUE, 'nfts', 50, 'mystery_boxes', 10);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.seed_dev_test_nfts(UUID) IS
  'Seeds 50 test NFTs + 10 mystery boxes for the given user. '
  'Only callable via service_role (Edge Function).';
