-- NFT System Schema Migration
-- Creates tables, types, and policies for the NFT system

-- Create enum type for NFT tiers (toilet-specific)
CREATE TYPE nft_tier AS ENUM ('cruise-seat', 'turbo-flush', 'zen-fortress');

-- Create enum type for NFT rarity (applies to all NFT types)
CREATE TYPE nft_rarity AS ENUM ('common', 'rare', 'legendary', 'transcendent');

-- Create the main NFTs table
CREATE TABLE nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  name TEXT NOT NULL,
  tier nft_tier NOT NULL,
  rarity nft_rarity NOT NULL,
  image_url TEXT NOT NULL,
  
  -- NFT Properties (0-100 range)
  efficiency INTEGER NOT NULL CHECK (efficiency >= 0 AND efficiency <= 100),
  resilience INTEGER NOT NULL CHECK (resilience >= 0 AND resilience <= 100),
  comfort INTEGER NOT NULL CHECK (comfort >= 0 AND comfort <= 100),
  luck INTEGER NOT NULL CHECK (luck >= 0 AND luck <= 100),
  
  -- Dynamic Properties
  energy INTEGER NOT NULL DEFAULT 100 CHECK (energy >= 0 AND energy <= 100),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketplace listings table
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price TEXT NOT NULL,  -- Price as string (e.g., "0.9 ETH")
  listed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure NFT can only be listed once
  UNIQUE(nft_id)
);

-- Trigger to validate seller owns the NFT before listing
-- (CHECK constraints don't support subqueries in PostgreSQL)
CREATE OR REPLACE FUNCTION validate_seller_owns_nft()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM nfts WHERE id = NEW.nft_id AND user_id = NEW.seller_id
  ) THEN
    RAISE EXCEPTION 'Seller does not own this NFT';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_seller_owns_nft
  BEFORE INSERT OR UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION validate_seller_owns_nft();

-- Indexes for performance
CREATE INDEX idx_nfts_user_id ON nfts(user_id);
CREATE INDEX idx_nfts_tier ON nfts(tier);
CREATE INDEX idx_nfts_rarity ON nfts(rarity);
CREATE INDEX idx_nfts_created_at ON nfts(created_at DESC);
CREATE INDEX idx_marketplace_listings_listed_at ON marketplace_listings(listed_at DESC);
CREATE INDEX idx_marketplace_listings_nft_id ON marketplace_listings(nft_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_nfts_updated_at
  BEFORE UPDATE ON nfts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for NFTs table

-- Users can view their own NFTs
CREATE POLICY "Users can view their own NFTs"
ON nfts FOR SELECT
USING (auth.uid() = user_id);

-- Users can view NFTs that are listed on marketplace
CREATE POLICY "Users can view listed NFTs"
ON nfts FOR SELECT
USING (
  id IN (SELECT nft_id FROM marketplace_listings)
);

-- Users can insert their own NFTs (for breeding/minting)
CREATE POLICY "Users can create their own NFTs"
ON nfts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update only their own NFTs
CREATE POLICY "Users can update their own NFTs"
ON nfts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own NFTs
CREATE POLICY "Users can delete their own NFTs"
ON nfts FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for marketplace_listings table

-- Anyone can view marketplace listings
CREATE POLICY "Anyone can view marketplace listings"
ON marketplace_listings FOR SELECT
USING (true);

-- Users can list their own NFTs
CREATE POLICY "Users can list their own NFTs"
ON marketplace_listings FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Users can unlist their own NFTs
CREATE POLICY "Users can unlist their own NFTs"
ON marketplace_listings FOR DELETE
USING (auth.uid() = seller_id);

-- Users can update their own listings (e.g., change price)
CREATE POLICY "Users can update their own listings"
ON marketplace_listings FOR UPDATE
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

-- Helper function to get NFT with listing status
CREATE OR REPLACE FUNCTION get_nft_with_listing_status(nft_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  tier nft_tier,
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
    n.tier,
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
    CASE WHEN ml.id IS NOT NULL THEN true ELSE false END as is_listed,
    ml.price as listing_price
  FROM nfts n
  LEFT JOIN marketplace_listings ml ON n.id = ml.nft_id
  WHERE n.id = nft_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_nft_with_listing_status(UUID) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE nfts IS 'Stores user-owned NFT toilet collectibles with properties and metadata';
COMMENT ON TABLE marketplace_listings IS 'Tracks which NFTs are currently listed for sale on the marketplace';
COMMENT ON COLUMN nfts.efficiency IS 'Mining/earning efficiency (0-100)';
COMMENT ON COLUMN nfts.resilience IS 'Durability/resistance to damage (0-100)';
COMMENT ON COLUMN nfts.comfort IS 'Comfort bonus for user experience (0-100)';
COMMENT ON COLUMN nfts.luck IS 'Affects mystery box/bonus reward chances (0-100)';
COMMENT ON COLUMN nfts.energy IS 'Current energy level, depletes during use (0-100)';
COMMENT ON COLUMN nfts.level IS 'NFT progression level (1-20)';
