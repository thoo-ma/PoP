-- Seed all 10 game_config rows with their default values from shared/.
--
-- Strategy: INSERT the full defaults, ON CONFLICT merge so that any keys
-- already in the DB win (existing overrides are preserved) while missing
-- keys are filled in from the defaults.
--
--   EXCLUDED.value         → the defaults being inserted
--   public.game_config.value → whatever is already in the DB
--   EXCLUDED.value || game_config.value → DB values win on duplicate keys;
--                                         default values fill gaps
--
-- This is safe to run repeatedly (idempotent for rows that are already
-- fully seeded) and handles partially-migrated rows like cloud_run, which
-- was seeded with only {"DETECTIONS_PER_DAY": 10} by a previous migration.

INSERT INTO public.game_config (key, value) VALUES

-- ─── 1. currency ─────────────────────────────────────────────────────────────
('currency', '{
  "REWARD_BASE_PRICE_USD":    0.004,
  "REWARD_GROWTH_RATE":       1.08,
  "REWARD_USD_PER_TOKEN":     0.002,
  "REWARD_TYPE_MULTIPLIER": {
    "turbo-flush":  1.5,
    "cruise-seat":  1.0,
    "zen-fortress": 0.8
  },
  "REWARD_RARITY_MULTIPLIER": {
    "common":       1,
    "rare":         2,
    "legendary":    5,
    "transcendent": 12
  },
  "REPAIR_COEF_A":            0.85,
  "REPAIR_COEF_B":            4.15,
  "REPAIR_USD_PER_TOKEN":     0.002,
  "REPAIR_RARITY_MULTIPLIER": {
    "common":       1.0,
    "rare":         1.2,
    "legendary":    1.5,
    "transcendent": 2.0
  },
  "BREED_BASE_PRICE_USD":    0.20,
  "BREED_GROWTH_RATE":       2.5,
  "BREED_USD_PER_TOKEN":     0.002,
  "BREED_MAX_COUNT":         5,
  "BREED_RARITY_MULTIPLIER": {
    "common":       1,
    "rare":         8,
    "legendary":    40,
    "transcendent": 150
  }
}'::jsonb),

-- ─── 2. cooldown ─────────────────────────────────────────────────────────────
('cooldown', '{
  "COOLDOWN_BASES": {
    "turbo-flush":  3,
    "cruise-seat":  10,
    "zen-fortress": 22
  },
  "LINEAR_MULT": 0.3,
  "EXP_MULT":    0.02
}'::jsonb),

-- ─── 3. xp ───────────────────────────────────────────────────────────────────
('xp', '{
  "XP_PER_USE":           15,
  "XP_FORMULA_BASE":      25,
  "XP_FORMULA_LINEAR":    5,
  "XP_FORMULA_QUADRATIC": 0.3,
  "XP_FORMULA_FLOOR":     33
}'::jsonb),

-- ─── 4. stat_points ──────────────────────────────────────────────────────────
('stat_points', '{
  "STAT_POINTS_BY_RARITY": {
    "common":       4,
    "rare":         10,
    "legendary":    14,
    "transcendent": 18
  }
}'::jsonb),

-- ─── 5. breed ────────────────────────────────────────────────────────────────
('breed', '{
  "BREED_PROBABILITIES": {
    "common+common":             [97.9,  2.0,  0.1,  0.0],
    "common+rare":               [65.0, 34.0,  0.9,  0.1],
    "rare+rare":                 [ 5.0, 92.0,  2.5,  0.5],
    "rare+legendary":            [ 2.0, 20.0, 75.0,  3.0],
    "legendary+legendary":       [ 1.0,  9.0, 80.0, 10.0],
    "legendary+transcendent":    [ 0.5,  4.5, 25.0, 70.0],
    "transcendent+transcendent": [ 0.1,  1.9,  8.0, 90.0]
  }
}'::jsonb),

-- ─── 6. minting ──────────────────────────────────────────────────────────────
('minting', '{
  "STAT_RANGES": {
    "common":       [40, 70],
    "rare":         [50, 80],
    "legendary":    [60, 90],
    "transcendent": [70, 100]
  }
}'::jsonb),

-- ─── 7. sensors ──────────────────────────────────────────────────────────────
('sensors', '{
  "SENSOR_PRESETS": {
    "easy": {
      "MOVEMENT_THRESHOLD": 0.20,
      "ROTATION_THRESHOLD": 0.15,
      "STEP_COOLDOWN":      2500,
      "GRACE_PERIOD":       800,
      "WARNING_COOLDOWN":   2000
    },
    "normal": {
      "MOVEMENT_THRESHOLD": 0.15,
      "ROTATION_THRESHOLD": 0.10,
      "STEP_COOLDOWN":      1500,
      "GRACE_PERIOD":       500,
      "WARNING_COOLDOWN":   1500
    },
    "strict": {
      "MOVEMENT_THRESHOLD": 0.08,
      "ROTATION_THRESHOLD": 0.05,
      "STEP_COOLDOWN":      1000,
      "GRACE_PERIOD":       300,
      "WARNING_COOLDOWN":   1000
    }
  },
  "AUDIO_THRESHOLDS": {
    "easy":   0.3,
    "normal": 0.5,
    "strict": 0.7
  }
}'::jsonb),

-- ─── 8. energy_drain ─────────────────────────────────────────────────────────
('energy_drain', '{
  "TYPE_DRAIN_MULT": {
    "turbo-flush":  3,
    "cruise-seat":  1.5,
    "zen-fortress": 1
  },
  "ENERGY_ROLL_MIN": 5,
  "ENERGY_ROLL_MAX": 15
}'::jsonb),

-- ─── 9. loot_roll ────────────────────────────────────────────────────────────
('loot_roll', '{
  "BASE_WIN_PROBABILITY": 0.10,
  "PER_HOLD_INCREMENT":   0.10,
  "MAX_HOLDS":            3
}'::jsonb),

-- ─── 10. cloud_run ───────────────────────────────────────────────────────────
-- Note: this row was partially seeded by 20260304000002 with only
-- {"DETECTIONS_PER_DAY": 10}. The merge strategy below fills in the
-- remaining keys while preserving the existing DETECTIONS_PER_DAY value.
('cloud_run', '{
  "YAMNET_TOILET_FLUSH_CLASS": 368,
  "MAX_AUDIO_DURATION":        30.0,
  "MIN_AUDIO_DURATION":        0.5,
  "DETECTIONS_PER_DAY":        10
}'::jsonb)

ON CONFLICT (key) DO UPDATE
  -- DB values win on duplicate keys; defaults fill any gaps.
  SET value = EXCLUDED.value || public.game_config.value;
