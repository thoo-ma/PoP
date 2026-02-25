-- Fix seed functions for the new schema (type/name columns) and add XP support.
--
-- Both seed_dev_test_nfts() and validate_and_approve_user() were written against
-- the old column names (tier, variant, display-name) that were renamed in
-- 20260223000000_rename_nft_columns.sql.  They also predate the xp column added
-- in 20260225000000_add_nft_xp.sql.
--
-- Rather than hardcoding level values, NFT progression is expressed as a single
-- total_xp integer.  _xp_decompose() converts that into (level, within-level xp)
-- using the same formula as the use-nft edge function:
--
--   threshold(l) = GREATEST(33, ROUND(25 + l*5 + l^2*0.3))
--
-- reference total_xp values for level mid-points used in the dev seed:
--   lv1≈16  lv2≈51  lv3≈90  lv4≈137  lv5≈191  lv6≈253  lv7≈323
--   lv8≈403 lv9≈492 lv10≈591 lv11≈702 lv12≈824 lv13≈958 lv14≈1106
--   lv15≈1267 lv16≈1442 lv17≈1631 lv18≈1836 lv19≈2056 lv20=2292

-- ─── XP helper ────────────────────────────────────────────────────────────────
-- Converts cumulative total_xp → (level, within-level xp).
-- Returns exactly one row; safe as a CROSS JOIN LATERAL target.

CREATE OR REPLACE FUNCTION _xp_decompose(total_xp INTEGER)
RETURNS TABLE(lv INTEGER, xp_rem INTEGER)
LANGUAGE plpgsql STABLE AS $$
DECLARE
  thr INTEGER;
BEGIN
  lv     := 1;
  xp_rem := total_xp;
  LOOP
    IF lv >= 20 THEN
      xp_rem := LEAST(xp_rem, 245);  -- cap within max-level bar
      RETURN NEXT;
      RETURN;
    END IF;
    thr := GREATEST(33, ROUND(25 + lv * 5 + lv * lv * 0.3)::INTEGER);
    EXIT WHEN xp_rem < thr;
    xp_rem := xp_rem - thr;
    lv     := lv + 1;
  END LOOP;
  RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION _xp_decompose(INTEGER) IS
  'Converts cumulative XP into (level, within-level xp). Used by seed functions.';

-- ─── seed_dev_test_nfts ────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS public.seed_dev_test_nfts();

CREATE OR REPLACE FUNCTION public.seed_dev_test_nfts()
RETURNS JSON AS $$
DECLARE
  v_user_id    UUID;
  v_base_url   TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co/storage/v1/object/public/assets/toilets/';
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Not authenticated');
  END IF;

  -- Fresh slate for dev re-runs
  DELETE FROM public.marketplace_listings WHERE seller_id = v_user_id;
  DELETE FROM public.nfts               WHERE user_id    = v_user_id;

  INSERT INTO public.nfts
    (user_id, type, name, rarity, image_url, efficiency, resilience, comfort, luck, energy, level, xp)
  SELECT
    v_user_id,
    v.nft_type::nft_type,
    v.nft_name,
    v.nft_rarity::nft_rarity,
    v_base_url || v.nft_type || '/' || v.nft_name || '/' || v.nft_name || '-' || v.nft_rarity || '.jpg',
    v.eff, v.res, v.com, v.lck, v.nrg,
    d.lv, d.xp_rem
  FROM (VALUES
    -- ── CRUISE-SEAT (15) ───────────────────────────────── type, name, rarity, eff, res, com, lck, nrg, total_xp
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
    -- ── TURBO-FLUSH (18) ──────────────────────────────────────────────────────
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
    -- ── ZEN-FORTRESS (17) ─────────────────────────────────────────────────────
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

  RETURN json_build_object(
    'success',   TRUE,
    'message',   'Successfully created 50 test NFTs',
    'nft_count', 50
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', FALSE, 'error', 'Failed to create NFTs: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.seed_dev_test_nfts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_dev_test_nfts() TO anon;

COMMENT ON FUNCTION public.seed_dev_test_nfts() IS
  'Seeds 50 test NFTs for the current user. Deletes existing NFTs first. Dev/testing only.';

-- ─── validate_and_approve_user ────────────────────────────────────────────────
-- Fixes column names (tier→type, variant→name, dropped display-name) and adds xp=0.

DROP FUNCTION IF EXISTS public.validate_and_approve_user(TEXT);

CREATE OR REPLACE FUNCTION public.validate_and_approve_user(p_code TEXT)
RETURNS JSON AS $$
DECLARE
  v_code_record   RECORD;
  v_user_id       UUID;
  v_variants      TEXT[] := ARRAY[
    'ancient-egyptian', 'ancient-maya-stone',
    'medieval-castle-garderobe', 'prehistoric-stone', 'victorian-era-wooden-throne'
  ];
  v_random_name   TEXT;
  v_image_url     TEXT;
  v_base_url      TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co/storage/v1/object/public/assets/toilets/';
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Not authenticated');
  END IF;

  -- Already approved — idempotent success
  IF EXISTS (SELECT 1 FROM public.users WHERE id = v_user_id AND approved = TRUE) THEN
    RETURN json_build_object('success', TRUE, 'error', NULL);
  END IF;

  p_code := upper(trim(p_code));

  IF NOT (p_code ~ '^[A-Z0-9]{8}$') THEN
    RETURN json_build_object('success', FALSE, 'error', 'Invalid code format');
  END IF;

  SELECT * INTO v_code_record FROM public.invite_codes WHERE code = p_code;

  IF v_code_record IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Invalid invite code');
  END IF;

  IF v_code_record.revoked = TRUE THEN
    RETURN json_build_object('success', FALSE, 'error', 'This invite code has been revoked');
  END IF;

  IF v_code_record.used_by IS NOT NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'This invite code has already been used');
  END IF;

  IF v_code_record.expires_at IS NOT NULL AND v_code_record.expires_at < NOW() THEN
    RETURN json_build_object('success', FALSE, 'error', 'This invite code has expired');
  END IF;

  BEGIN
    UPDATE public.invite_codes
    SET used_by = v_user_id, used_at = NOW()
    WHERE id = v_code_record.id;

    UPDATE public.users
    SET approved = TRUE, invite_code_id = v_code_record.id
    WHERE id = v_user_id;

    -- Starter NFT: random cruise-seat variant, common rarity, level 1, xp 0
    v_random_name := v_variants[floor(random() * array_length(v_variants, 1) + 1)::INTEGER];
    v_image_url   := v_base_url || 'cruise-seat/' || v_random_name || '/' || v_random_name || '-common.jpg';

    INSERT INTO public.nfts
      (user_id, type,                name,          rarity,           image_url,    efficiency, resilience, comfort, luck, energy, level, xp)
    VALUES
      (v_user_id, 'cruise-seat'::nft_type, v_random_name, 'common'::nft_rarity, v_image_url, 60,         65,         55,      58,   100,    1,     0);

    RETURN json_build_object('success', TRUE, 'error', NULL);

  EXCEPTION
    WHEN OTHERS THEN
      RETURN json_build_object('success', FALSE, 'error', 'Failed to approve user: ' || SQLERRM);
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.validate_and_approve_user(TEXT) TO authenticated;

COMMENT ON FUNCTION public.validate_and_approve_user(TEXT) IS
  'Validates invite code, approves user, and creates a starter cruise-seat NFT at level 1 / xp 0.';
