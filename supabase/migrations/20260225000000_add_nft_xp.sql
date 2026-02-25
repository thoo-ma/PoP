-- Add XP field to NFTs
-- xp: experience points within the current level, resets to 0 on level-up.
-- level already exists and is updated alongside xp inside the use-nft edge function.
--
-- XP formula (per poop, and threshold to advance):
--   xp_gained / threshold(level) = round(25 + level * 5 + level^2 * 0.3)
--   Special-cased: level 1 minimum is 33.
-- Levels: 1–20.  Max bar size: 245 (threshold at level 20).

-- 1. Add column
ALTER TABLE nfts
  ADD COLUMN xp INTEGER NOT NULL DEFAULT 0;

ALTER TABLE nfts
  ADD CONSTRAINT nfts_xp_non_negative CHECK (xp >= 0);

-- 2. Recreate get_nft_with_listing_status to expose xp
DROP FUNCTION IF EXISTS get_nft_with_listing_status(UUID);
CREATE FUNCTION get_nft_with_listing_status(nft_id UUID)
RETURNS TABLE (
  id           UUID,
  user_id      UUID,
  name         TEXT,
  type         nft_type,
  rarity       nft_rarity,
  image_url    TEXT,
  efficiency   INTEGER,
  resilience   INTEGER,
  comfort      INTEGER,
  luck         INTEGER,
  energy       INTEGER,
  level        INTEGER,
  xp           INTEGER,
  created_at   TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ,
  is_listed    BOOLEAN,
  listing_price TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.user_id,
    n.name,
    n.type,
    n.rarity,
    n.image_url,
    n.efficiency,
    n.resilience,
    n.comfort,
    n.luck,
    n.energy,
    n.level,
    n.xp,
    n.created_at,
    n.updated_at,
    CASE WHEN ml.id IS NOT NULL THEN true ELSE false END AS is_listed,
    ml.price AS listing_price
  FROM nfts n
  LEFT JOIN marketplace_listings ml ON n.id = ml.nft_id
  WHERE n.id = nft_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Comments
COMMENT ON COLUMN nfts.xp IS 'XP within the current level (0 … threshold). Resets to remainder on level-up. Updated by the use-nft edge function.';
