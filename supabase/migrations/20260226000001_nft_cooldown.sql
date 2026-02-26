-- Add last_used_at to nfts to support per-NFT cooldown enforcement.
--
-- The use-nft edge function writes this timestamp on every successful use,
-- then checks it on the next call to enforce the cooldown window.  The window
-- duration is computed from the NFT's type and level:
--
--   cooldown_hours = base + (level × 0.3) + (level² × 0.002)
--
-- Type bases (hours):  turbo-flush = 3  |  cruise-seat = 10  |  zen-fortress = 22
--
-- NULL means "never used" → always ready.

ALTER TABLE public.nfts
  ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ DEFAULT NULL;

-- Explicitly reload the PostgREST schema cache.
NOTIFY pgrst, 'reload schema';
