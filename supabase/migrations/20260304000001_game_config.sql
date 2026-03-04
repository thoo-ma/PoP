-- game_config: live-editable game balance constants
--
-- Each row stores the tunable parameters for one mechanic category.
-- Valid keys:  currency | cooldown | xp | stat_points | breed | minting
--              sensors  | energy_drain | loot_roll | cloud_run
--
-- The edge-function helper (supabase/functions/_shared/gameConfig.ts) reads
-- these rows, validates each JSONB blob with its Zod schema, and deep-merges
-- valid overrides over the hard-coded shared/ defaults.  Invalid or missing
-- rows fall back silently to the defaults — the game always runs.
--
-- RLS:
--   • Authenticated users (including the dashboard) can READ.
--   • Only principals whose JWT carries `app_role = 'admin'` can WRITE.
--   • Edge Functions use the service-role key and bypass RLS entirely.

CREATE TABLE IF NOT EXISTS public.game_config (
  key        TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep updated_at fresh automatically
CREATE OR REPLACE FUNCTION public.set_game_config_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER game_config_updated_at
  BEFORE UPDATE ON public.game_config
  FOR EACH ROW EXECUTE FUNCTION public.set_game_config_updated_at();

-- ─── Row-Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.game_config ENABLE ROW LEVEL SECURITY;

-- Any authenticated user (dashboard included) may read
CREATE POLICY "authenticated_read" ON public.game_config
  FOR SELECT TO authenticated USING (true);

-- Anon key can also read (useful during dashboard development)
CREATE POLICY "anon_read" ON public.game_config
  FOR SELECT TO anon USING (true);

-- Only admins can insert / update / delete
CREATE POLICY "admin_write" ON public.game_config
  FOR ALL TO authenticated
  USING      ((auth.jwt() ->> 'app_role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'app_role') = 'admin');
