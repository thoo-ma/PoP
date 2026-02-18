-- Add variant column to NFTs
-- Each tier has specific named variants that map to storage folder structure

-- First, add the variant column as nullable
ALTER TABLE nfts ADD COLUMN variant TEXT;

-- Create function to randomly assign variants based on tier
CREATE OR REPLACE FUNCTION assign_random_variant()
RETURNS void AS $$
DECLARE
  cruise_seat_variants TEXT[] := ARRAY['ancient-egyptian', 'ancient-maya-stone', 'medieval-castle-garderobe', 'prehistoric-stone', 'victorian-era-wooden-throne'];
  turbo_flush_variants TEXT[] := ARRAY['astronaut-zero-gravity', 'portable-construction-site-cabin', 'prehistoric-sanitation', 'roman-public-latrines', 'rustic-forest-outhouse', 'squat'];
  zen_fortress_variants TEXT[] := ARRAY['cyberpunk-dystopian', 'dubai', 'eco-friendly', 'futuristic-sci-fi-vacuum', 'renaissance-chaise'];
BEGIN
  -- Update cruise-seat NFTs
  UPDATE nfts
  SET variant = cruise_seat_variants[floor(random() * array_length(cruise_seat_variants, 1) + 1)::int]
  WHERE tier = 'cruise-seat' AND variant IS NULL;
  
  -- Update turbo-flush NFTs
  UPDATE nfts
  SET variant = turbo_flush_variants[floor(random() * array_length(turbo_flush_variants, 1) + 1)::int]
  WHERE tier = 'turbo-flush' AND variant IS NULL;
  
  -- Update zen-fortress NFTs
  UPDATE nfts
  SET variant = zen_fortress_variants[floor(random() * array_length(zen_fortress_variants, 1) + 1)::int]
  WHERE tier = 'zen-fortress' AND variant IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Assign variants to existing NFTs
SELECT assign_random_variant();

-- Now make the column NOT NULL
ALTER TABLE nfts ALTER COLUMN variant SET NOT NULL;

-- Update image_url to match new storage structure for existing NFTs
-- Pattern: toilets/{tier}/{variant}/{variant}-{rarity}.jpg
UPDATE nfts
SET image_url = 'https://mtnluwkvhkwwxvxdtkgs.supabase.co/storage/v1/object/public/assets/toilets/' 
  || tier || '/' 
  || variant || '/' 
  || variant || '-' 
  || rarity || '.jpg';

-- Create index for efficient lookups
CREATE INDEX idx_nfts_tier_variant ON nfts(tier, variant);
CREATE INDEX idx_nfts_tier_variant_rarity ON nfts(tier, variant, rarity);

-- Drop the function as it's no longer needed
DROP FUNCTION assign_random_variant();

-- Add comment for documentation
COMMENT ON COLUMN nfts.variant IS 'Named variant of the NFT (e.g., ancient-egyptian, dubai). Maps to storage folder structure: toilets/{tier}/{variant}/{variant}-{rarity}.jpg';
