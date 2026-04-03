---
name: game-config
description: "Game balance config-as-code reference for the PoP monorepo. Maps all 11 config keys to their source files, formula functions, Zod schemas, consumers, structural invariants, and semantic constraints. Use when tuning game balance constants, reviewing config changes, or understanding downstream impact. Keywords: game config, balance, tuning, constants, economy, cooldown, XP, currency, breed, loot, degen bar, energy drain, minting, stat points, sensors."
user-invocable: false
metadata:
  author: PoP team
  version: "1.0.0"
---

# Skill: Game Config

Reference for all tunable game balance constants in `shared/*.ts`. Every config key
maps to a source file, formula functions, a Zod schema, and a set of consumers.

## Config Key → File Map

| # | Config Key | Source File | Formula Functions | Zod Schema (in `shared/schemas.ts`) |
|---|---|---|---|---|
| 1 | **currency** | `shared/currency.ts` | `repairCost()`, `breedCost()`, `calcPoopEarned()` | `CurrencyConfigSchema` |
| 2 | **cooldown** | `shared/cooldown.ts` | `calcCooldownHours()`, `getCooldownEndsAt()`, `isOnCooldown()`, `cooldownRemainingSeconds()` | `CooldownConfigSchema` |
| 3 | **xp** | `shared/xp.ts` | `xpThreshold()`, `applyXP()` | `XpConfigSchema` |
| 4 | **statPoints** | `shared/statPoints.ts` | — | `StatPointsConfigSchema` |
| 5 | **breedProbabilities** | `shared/breedProbabilities.ts` | — | `BreedConfigSchema` |
| 6 | **minting** | `shared/minting.ts` | — | `MintingConfigSchema` |
| 7 | **energyDrain** | `shared/energyDrain.ts` | — | `EnergyDrainConfigSchema` |
| 8 | **lootRoll** | `shared/lootRoll.ts` | — | `LootRollConfigSchema` |
| 9 | **degenBar** | `shared/degenBar.ts` | `calcReduction()`, `calcBustChance()`, `calcReducedCost()`, `resolveDegenOutcome()` | `DegenBarConfigSchema` |
| 10 | **sensors** | `shared/sensors.ts` | `getThresholds()`, `getThresholdForDifficulty()` | `SensorsConfigSchema` |
| 11 | **cloudRun** | `shared/cloudRun.ts` | — | `CloudRunConfigSchema` |

### Key Constants Per Config Key

<details>
<summary><strong>currency</strong> — token economics for repair, breed, and use rewards</summary>

**Repair**: `REPAIR_COEF_A` (0.85), `REPAIR_COEF_B` (4.15), `REPAIR_USD_PER_TOKEN` (0.002), `REPAIR_RARITY_MULTIPLIER` (common: 1.0, rare: 1.2, legendary: 1.5, transcendent: 2.0)

**Breed**: `BREED_BASE_PRICE_USD` (0.2), `BREED_GROWTH_RATE` (2.5), `BREED_USD_PER_TOKEN` (0.002), `BREED_MAX_COUNT` (5), `BREED_RARITY_MULTIPLIER` (common: 1, rare: 8, legendary: 40, transcendent: 150)

**Use Reward**: `REWARD_BASE_PRICE_USD` (0.004), `REWARD_GROWTH_RATE` (1.08), `REWARD_USD_PER_TOKEN` (0.002), `REWARD_RARITY_MULTIPLIER` (common: 1, rare: 2, legendary: 5, transcendent: 12), `REWARD_TYPE_MULTIPLIER` (turbo-flush: 1.5, cruise-seat: 1.0, zen-fortress: 0.8)
</details>

<details>
<summary><strong>cooldown</strong> — per-type cooldown curves</summary>

`COOLDOWN_BASES` (turbo-flush: 3h, cruise-seat: 10h, zen-fortress: 22h), `LINEAR_MULT` (0.3), `EXP_MULT` (0.02)

Formula: `base + level × LINEAR_MULT + level² × EXP_MULT`
</details>

<details>
<summary><strong>xp</strong> — leveling curve</summary>

`XP_PER_USE` (15), `XP_FORMULA_BASE` (25), `XP_FORMULA_LINEAR` (5), `XP_FORMULA_QUADRATIC` (0.3), `XP_FORMULA_FLOOR` (33), `MAX_LEVEL` (20 — **invariant**)

Formula: `xpThreshold(level) = max(FLOOR, round(BASE + level × LINEAR + level² × QUADRATIC))`
</details>

<details>
<summary><strong>statPoints</strong> — stat allocation per level-up</summary>

`STAT_POINTS_BY_RARITY` (common: 4, rare: 10, legendary: 14, transcendent: 18), `MAX_ENERGY` (100 — **invariant**), `MAX_STAT_VALUE` (100 — **invariant**)
</details>

<details>
<summary><strong>breedProbabilities</strong> — breed outcome odds</summary>

`BREED_PROBABILITIES`: 7 rarity pair rows, each a `[common%, rare%, legendary%, transcendent%]` tuple.

Example: `'common+common': [97.9, 2.0, 0.1, 0.0]`
</details>

<details>
<summary><strong>minting</strong> — initial NFT stat ranges</summary>

`STAT_RANGES` (common: [40, 70], rare: [50, 80], legendary: [60, 90], transcendent: [70, 100])
</details>

<details>
<summary><strong>energyDrain</strong> — energy loss per use</summary>

`TYPE_DRAIN_MULT` (turbo-flush: 3, cruise-seat: 1.5, zen-fortress: 1), `ENERGY_ROLL_MIN` (5), `ENERGY_ROLL_MAX` (15)

Formula: `loss = random[ROLL_MIN, ROLL_MAX) × (1 - resilience/100) × TYPE_DRAIN_MULT[type]`
</details>

<details>
<summary><strong>lootRoll</strong> — loot probability + hold logic</summary>

`BASE_WIN_PROBABILITY` (0.1), `PER_HOLD_INCREMENT` (0.1), `MAX_HOLDS` (3)

Formula: `P(win) = BASE_WIN_PROBABILITY + holds × PER_HOLD_INCREMENT`
</details>

<details>
<summary><strong>degenBar</strong> — bust/reward risk curve</summary>

`SAFE_BUST_COEF` (0.08), `DEGEN_BUST_BASE` (2), `DEGEN_BUST_SCALE` (28), `DEGEN_ZONE_THRESHOLD` (25), `MAX_REDUCTION` (0.75)

SAFE zone (< threshold): linear bust via `SAFE_BUST_COEF`
DEGEN zone (≥ threshold): quadratic bust via `(DEGEN_BUST_BASE + f² × DEGEN_BUST_SCALE) / 100`
</details>

<details>
<summary><strong>sensors</strong> — difficulty presets for motion and audio</summary>

`SENSOR_PRESETS` (easy/normal/strict) with thresholds for movement, rotation, step cooldown, grace period, warning cooldown.

`AUDIO_THRESHOLDS` (easy: 0.3, normal: 0.5, strict: 0.7)
</details>

<details>
<summary><strong>cloudRun</strong> — audio detection service config</summary>

`YAMNET_TOILET_FLUSH_CLASS` (368), `MAX_AUDIO_DURATION` (30.0s), `MIN_AUDIO_DURATION` (0.5s), `DETECTIONS_PER_DAY` (10)
</details>

## Structural Invariants

These constants are **architectural foundations**, not tunable balance knobs. The `config-tuner` agent must **NEVER** modify them.

| Constant | Value | File | Why |
|---|---|---|---|
| `MAX_LEVEL` | 20 | `shared/xp.ts` | Level cap — changing breaks XP curve assumptions, stat budgets, UI layouts |
| `MAX_ENERGY` | 100 | `shared/statPoints.ts` | Energy cap — used as denominator in repair cost formula |
| `MAX_STAT_VALUE` | 100 | `shared/statPoints.ts` | Per-stat hard cap — used in stat allocation validation |
| `RARITIES` | `['common', 'rare', 'legendary', 'transcendent']` | `shared/nft.ts` | Rarity enum — referenced everywhere as type discriminator |
| `NFT_TYPES` | `['cruise-seat', 'turbo-flush', 'zen-fortress']` | `shared/nft.ts` | Type enum — referenced everywhere as type discriminator |
| `RARITY_RANK` | `{common: 0, rare: 1, ...}` | `shared/nft.ts` | Numeric ordering — used in breed pair validation |
| `TYPE_NAMES` | Per-type name arrays | `shared/nft.ts` | Asset names — tied to image assets |
| Error codes | `EdgeFunctionErrorCode` map | `shared/errors.ts` | HTTP contract — frontend/backend depend on these codes |
| `database.types.ts` | Auto-generated | `shared/database.types.ts` | Generated by `supabase gen types` — never hand-edit |

## Semantic Constraints

Constraints that Zod schemas cannot express. The agent must verify these manually before applying any change.

### Breed probabilities must sum to 100.0

Each row in `BREED_PROBABILITIES` is a `[common%, rare%, legendary%, transcendent%]` tuple. The four values **must sum to exactly 100.0** for each rarity pair.

```
✓ [97.9, 2.0, 0.1, 0.0]  → sum = 100.0
✗ [97.9, 2.0, 0.2, 0.0]  → sum = 100.1  ← INVALID
```

### Breed pair rank diff ≤ 1

Breed pairs use the `BreedPairKey` type which enforces that the rarity rank difference is at most 1, and pairs are always sorted lower+higher (e.g. `'common+rare'`, never `'rare+common'`). Do not add pairs that violate this.

### Cooldown ordering invariant

Cooldown base hours must maintain the architectural ordering: `turbo-flush < cruise-seat < zen-fortress`. Turbo-flush is the fastest (shortest cooldown), zen-fortress is the slowest (longest cooldown). This ordering is a core game design pillar.

### XP formula must be monotonically non-decreasing

`xpThreshold(level)` must not decrease as level increases. After changing XP formula constants, compute a full table from level 1 to `MAX_LEVEL` and verify the sequence is non-decreasing.

### Energy drain roll range

`ENERGY_ROLL_MIN` must be strictly less than `ENERGY_ROLL_MAX`. The range is `[min, max)` (min inclusive, max exclusive).

### Loot probability cap

The maximum loot win probability must not exceed 1.0:
```
BASE_WIN_PROBABILITY + MAX_HOLDS × PER_HOLD_INCREMENT ≤ 1.0
```

### Degen bar zone threshold

`DEGEN_ZONE_THRESHOLD` must be in `(0, 100)` — the SAFE and DEGEN zones must both have nonzero width. `MAX_REDUCTION` must be in `(0, 1]`.

### Minting stat ranges increase with rarity

Each `STAT_RANGES` tuple `[min, max]` must satisfy `min ≤ max`. The ranges should generally increase with rarity (higher rarities get higher stat floors and ceilings).

### USD-per-token consistency

`REPAIR_USD_PER_TOKEN`, `BREED_USD_PER_TOKEN`, and `REWARD_USD_PER_TOKEN` represent the same token's USD value. Changing one without the others creates an inconsistent economy. Flag this to the human if a change affects only one.

## Consumer Map

Which systems consume each config key. The agent must consider downstream impact before changing any constant.

| Config Key | Supabase Edge Functions | Frontend | Dashboard |
|---|---|---|---|
| **currency** | `breed-nfts/handler.ts`, `repair-nft/handler.ts`, `use-nft/handler.ts` | `screens/nft/Breed.tsx`, `screens/nft/Repair.tsx` | `gameConfigStore.ts` |
| **cooldown** | `use-nft/handler.ts` | `constants/cooldown.ts` | `gameConfigStore.ts`, `cooldown/page.tsx` |
| **xp** | `use-nft/handler.ts` | `components/nft/NFTCard.tsx` | `gameConfigStore.ts`, `xp/page.tsx` |
| **statPoints** | `allocate-stat-points/handler.ts`, `repair-nft/handler.ts`, `use-nft/handler.ts` | — | `gameConfigStore.ts`, `stat-points/page.tsx` |
| **breedProbabilities** | `breed-nfts/handler.ts` | `utils/nft/breedHelpers.ts` | `gameConfigStore.ts` |
| **minting** | `_shared/nftHelpers.ts` | — | `gameConfigStore.ts` |
| **energyDrain** | `use-nft/handler.ts` | — | `gameConfigStore.ts` |
| **lootRoll** | `hold-loot-roll/handler.ts`, `roll-loot/handler.ts` | — | `gameConfigStore.ts` |
| **degenBar** | `_shared/degenBar.ts`, `_shared/processPayment.ts` | `components/shared/DegenBar.tsx`, `screens/nft/Breed.tsx`, `screens/nft/Repair.tsx` | `gameConfigStore.ts`, `degen-bar/page.tsx` |
| **sensors** | — | `hooks/proof/useImmobilityChallenge.ts`, `screens/nft/Poop.tsx` | `gameConfigStore.ts` |
| **cloudRun** | `detect-toilet-flush/handler.ts` | — | `gameConfigStore.ts` |

### Impact Severity Guide

| Impact Level | Description | Example |
|---|---|---|
| **Low** | Single system, no cross-cutting effects | Changing `DETECTIONS_PER_DAY` (only cloudRun + detect-toilet-flush) |
| **Medium** | Multiple consumers, but isolated formula | Changing `XP_PER_USE` (edge function + frontend display) |
| **High** | Cross-cutting economy change | Changing `BREED_RARITY_MULTIPLIER` (affects breed cost, player economy, rarity value) |
| **Critical** | Multi-key rebalance | Changing currency + breed probabilities + stat points simultaneously |

## Example Change Recipes

Pre-written patterns for common tuning requests. Each recipe lists the constants to change, the file to edit, and what to verify.

### 1. "Make repairs cheaper"

**File**: `shared/currency.ts`
**Constants**: `REPAIR_COEF_A` (reduce), `REPAIR_COEF_B` (reduce), or `REPAIR_RARITY_MULTIPLIER` (reduce per-rarity)
**Verify**:
- Compute `repairCost()` for representative inputs (L1 common, L10 rare, L20 legendary) before and after
- Ensure repair cost never drops below 1 token (function already has `Math.round`)
- Check Zod bounds: `REPAIR_COEF_A` max 100, `REPAIR_COEF_B` max 100

### 2. "Slow down cooldowns"

**File**: `shared/cooldown.ts`
**Constants**: Increase `COOLDOWN_BASES` values, or increase `LINEAR_MULT` / `EXP_MULT` for steeper scaling
**Verify**:
- Maintain cooldown ordering: turbo-flush < cruise-seat < zen-fortress
- Compute `calcCooldownHours()` for L1 and L20 of each type
- Check Zod bounds: each base max 168h (one week), `LINEAR_MULT` max 10, `EXP_MULT` max 1

### 3. "Adjust loot rates"

**File**: `shared/lootRoll.ts`
**Constants**: `BASE_WIN_PROBABILITY`, `PER_HOLD_INCREMENT`, `MAX_HOLDS`
**Verify**:
- `BASE_WIN_PROBABILITY + MAX_HOLDS × PER_HOLD_INCREMENT ≤ 1.0`
- Compute P(win) for 0, 1, 2, 3 holds before and after
- Check Zod bounds: probabilities in [0, 1], `MAX_HOLDS` max 100

### 4. "Rebalance rarity economy" (multi-key)

**Files**: `shared/currency.ts`, `shared/breedProbabilities.ts`, `shared/statPoints.ts`
**Constants**: `BREED_RARITY_MULTIPLIER`, `REWARD_RARITY_MULTIPLIER`, `BREED_PROBABILITIES`, `STAT_POINTS_BY_RARITY`
**Verify**:
- Each breed probability row sums to 100.0
- Rarity multipliers maintain ordering (common < rare < legendary < transcendent)
- Stat points maintain ordering (common < rare < legendary < transcendent)
- Compute breed cost and use reward for each rarity at representative levels

### 5. "Tune degen bar risk"

**File**: `shared/degenBar.ts`
**Constants**: `SAFE_BUST_COEF`, `DEGEN_BUST_BASE`, `DEGEN_BUST_SCALE`, `DEGEN_ZONE_THRESHOLD`, `MAX_REDUCTION`
**Verify**:
- `DEGEN_ZONE_THRESHOLD` in (0, 100)
- `MAX_REDUCTION` in (0, 1]
- Compute `calcBustChance()` at 0%, 25%, 50%, 75%, 100% degen before and after
- Compute `calcReduction()` at same points
- Check that risk/reward curve feels balanced (higher risk = higher reward)
