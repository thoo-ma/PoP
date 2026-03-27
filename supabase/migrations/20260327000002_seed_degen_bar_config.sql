-- Seed the degen_bar row in game_config with the code defaults.
-- Follows the same merge strategy as 20260305000001_seed_game_config.sql:
-- DB values win on duplicate keys, defaults fill gaps.
INSERT INTO public.game_config (key, value)
VALUES (
  'degen_bar',
  '{
    "SAFE_BUST_COEF":      0.08,
    "DEGEN_BUST_BASE":     2,
    "DEGEN_BUST_SCALE":    28,
    "DEGEN_ZONE_THRESHOLD": 25,
    "MAX_REDUCTION":       0.75
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value || public.game_config.value;
