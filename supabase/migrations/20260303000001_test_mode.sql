-- ============================================================================
-- seed_test_mystery_boxes()
-- Gives the current user exactly 1 mystery box of each rarity (4 total).
-- Clears any existing unopened boxes first for a clean state on re-entry.
-- Used by "Test Mode" in the Expo Go dev login screen.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.seed_test_mystery_boxes()
RETURNS JSON AS $$
DECLARE
  v_user_id      UUID;
  v_supabase_url TEXT := 'https://mtnluwkvhkwwxvxdtkgs.supabase.co';
  v_box_base     TEXT;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Not authenticated');
  END IF;

  v_box_base := v_supabase_url || '/storage/v1/object/public/assets/mystery-boxes/';

  -- Clear existing mystery boxes for this user (clean slate on re-entry)
  DELETE FROM public.mystery_boxes WHERE user_id = v_user_id;

  -- Insert 1 box per rarity
  INSERT INTO public.mystery_boxes (user_id, rarity, image_url)
  VALUES
    (v_user_id, 'common'::nft_rarity,       v_box_base || 'common.jpg'),
    (v_user_id, 'rare'::nft_rarity,         v_box_base || 'rare.jpg'),
    (v_user_id, 'legendary'::nft_rarity,    v_box_base || 'legendary.jpg'),
    (v_user_id, 'transcendent'::nft_rarity, v_box_base || 'transcendent.jpg');

  RETURN json_build_object('success', TRUE, 'mystery_boxes', 4);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
