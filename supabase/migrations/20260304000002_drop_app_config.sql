-- Migrate rate-limit config from app_config → game_config.cloud_run
-- and drop the now-redundant app_config table.
--
-- The cloud_run row in game_config owns all per-request Cloud Run knobs
-- (audio durations, YAMNet class, and now the daily detection cap).
-- The edge function now reads this via getGameConfig() instead of querying
-- app_config directly.

-- Upsert the cloud_run row, merging detections_per_day into any existing value.
INSERT INTO public.game_config (key, value)
VALUES (
  'cloud_run',
  '{"detections_per_day": 10}'::jsonb
)
ON CONFLICT (key) DO UPDATE
  SET value = public.game_config.value || '{"detections_per_day": 10}'::jsonb;

-- Drop app_config (data fully replaced by game_config)
DROP TABLE IF EXISTS public.app_config;
