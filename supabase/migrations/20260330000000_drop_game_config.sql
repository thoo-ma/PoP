-- Drop game_config table — config is now managed as code constants.
-- See issue #256: "Remove DB fetch layer and simplify game config to constants-only"

DROP TRIGGER IF EXISTS set_game_config_updated_at ON public.game_config;
DROP FUNCTION IF EXISTS public.set_game_config_updated_at();
DROP TABLE IF EXISTS public.game_config;
