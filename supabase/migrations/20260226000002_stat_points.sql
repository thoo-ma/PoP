-- ─── Stat Points ─────────────────────────────────────────────────────────────
-- Adds a `stat_points` column to the `nfts` table.
-- Points are earned when an NFT levels up (see use-nft Edge Function) and
-- can be spent by the owner to increase efficiency / resilience / comfort / luck.
--
-- Points per level-up by rarity:
--   common       →  4 pts
--   rare         → 10 pts
--   legendary    → 14 pts
--   transcendent → 18 pts

ALTER TABLE nfts
  ADD COLUMN IF NOT EXISTS stat_points INTEGER NOT NULL DEFAULT 0
    CHECK (stat_points >= 0);

COMMENT ON COLUMN nfts.stat_points IS
  'Unspent stat points earned on level-up. Allocated to efficiency/resilience/comfort/luck by the owner.';
