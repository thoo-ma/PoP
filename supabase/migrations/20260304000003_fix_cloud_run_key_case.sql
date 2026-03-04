-- Rename the JSONB key detections_per_day → DETECTIONS_PER_DAY in the
-- game_config cloud_run row to match the uppercase convention used by all
-- other CloudRunConfigSchema fields.
--
-- This is a fixup for 20260304000002, which was pushed before the rename.

UPDATE public.game_config
SET value = (value - 'detections_per_day')
         || jsonb_build_object('DETECTIONS_PER_DAY', (value ->> 'detections_per_day')::int)
WHERE key = 'cloud_run'
  AND value ? 'detections_per_day';
