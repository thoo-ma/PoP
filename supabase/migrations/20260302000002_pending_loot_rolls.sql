-- ─── Pending loot rolls ──────────────────────────────────────────────────────
-- Tracks in-progress loot roulette sessions per user.
-- One row per user at most (UNIQUE on user_id): starting a new NFT use
-- overwrites any stale un-rolled session from a previous use.
--
-- holds: number of times the user chose to hold (0–3). Each hold adds +10%
--        to the base 10% loot chance at roll time.

CREATE TABLE public.pending_loot_rolls (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nft_id     UUID        NOT NULL,
  holds      SMALLINT    NOT NULL DEFAULT 0 CHECK (holds >= 0 AND holds <= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pending_loot_rolls_user_unique UNIQUE (user_id)
);

-- RLS: users can only see and modify their own row
ALTER TABLE public.pending_loot_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own pending loot roll"
  ON public.pending_loot_rolls
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast user-based lookups (also covered by UNIQUE but explicit)
CREATE INDEX IF NOT EXISTS pending_loot_rolls_user_id_idx
  ON public.pending_loot_rolls (user_id);
