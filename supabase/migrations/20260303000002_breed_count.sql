-- Add breed_count to nfts table.
--
-- Each NFT tracks how many times it has been used as a parent in a breed.
-- The value is capped at 5 (enforced in the breed-nfts edge function); at 5
-- the NFT can no longer participate as a parent.  The CHECK constraint is a
-- DB-level safety belt.

ALTER TABLE nfts
  ADD COLUMN breed_count INTEGER NOT NULL DEFAULT 0
    CHECK (breed_count >= 0 AND breed_count <= 5);

COMMENT ON COLUMN nfts.breed_count IS
  'Number of times this NFT has been used as a parent (0–5). '
  'Incremented by the breed-nfts edge function. Reaches 5 → breeding blocked.';
