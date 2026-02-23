-- Rename NFT columns and types
-- tier  → type  (also renames the nft_tier enum to nft_type)
-- name  → (dropped — was always a derived display label)
-- variant → name (slug identifier becomes the canonical name)

-- 1. Rename enum type
ALTER TYPE nft_tier RENAME TO nft_type;

-- 2. Drop the old derived display-name column
ALTER TABLE nfts DROP COLUMN name;

-- 3. Rename tier → type
ALTER TABLE nfts RENAME COLUMN tier TO type;

-- 4. Rename variant → name
ALTER TABLE nfts RENAME COLUMN variant TO name;

-- 5. Drop old indexes
DROP INDEX IF EXISTS idx_nfts_tier;
DROP INDEX IF EXISTS idx_nfts_tier_variant;
DROP INDEX IF EXISTS idx_nfts_tier_variant_rarity;

-- 6. Recreate indexes with new names
CREATE INDEX idx_nfts_type              ON nfts(type);
CREATE INDEX idx_nfts_type_name         ON nfts(type, name);
CREATE INDEX idx_nfts_type_name_rarity  ON nfts(type, name, rarity);

-- 7. Recreate get_nft_with_listing_status with updated column names
-- Must drop first because the return type changes (nft_tier → nft_type, variant → name)
DROP FUNCTION IF EXISTS get_nft_with_listing_status(UUID);
CREATE FUNCTION get_nft_with_listing_status(nft_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  type nft_type,
  rarity nft_rarity,
  image_url TEXT,
  efficiency INTEGER,
  resilience INTEGER,
  comfort INTEGER,
  luck INTEGER,
  energy INTEGER,
  level INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_listed BOOLEAN,
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
    n.created_at,
    n.updated_at,
    CASE WHEN ml.id IS NOT NULL THEN true ELSE false END AS is_listed,
    ml.price AS listing_price
  FROM nfts n
  LEFT JOIN marketplace_listings ml ON n.id = ml.nft_id
  WHERE n.id = nft_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Update column comment
COMMENT ON COLUMN nfts.name IS 'Named slug identifier (e.g. ancient-egyptian, dubai). Maps to storage: toilets/{type}/{name}/{name}-{rarity}.jpg';
COMMENT ON COLUMN nfts.type IS 'Toilet type (cruise-seat / turbo-flush / zen-fortress)';
