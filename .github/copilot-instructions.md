# PoP — Coding Standards

> **Owner**: `thoo-ma` · **Repo**: `PoP` · **Monorepo** with 5 areas, each has its own `.instructions.md` with area-specific rules. This file contains cross-cutting rules that apply everywhere.

## Monorepo Layout

**pnpm workspaces** — single root `pnpm-lock.yaml`, run `pnpm install` from root.

| Directory | Runtime | Key Dependency | Path Alias |
|---|---|---|---|
| `frontend/` | React Native + Expo 54 | HeroUI Native, Uniwind (Tailwind v4) | `@/*` → `./` · `@pop/shared` (workspace) |
| `dashboard/` | Next.js 14 (App Router) | Radix UI, Tailwind v3, Zustand | `@/*` → `./src/*` · `@pop/shared` (workspace) |
| `shared/` | `@pop/shared` workspace package — raw TS, no build step | Zod | — |
| `supabase/` | Deno (Edge Functions) | Supabase JS v2, Zod | Relative: `../../../shared/` |
| `google-cloud-run/` | Python 3.10 + Flask | TensorFlow, YAMNet | — |

⚠️ **frontend/ uses Tailwind v4 (Uniwind)**. **dashboard/ uses Tailwind v3**. They are NOT interchangeable. Do not copy styling patterns between them.

## Build & Validate — MANDATORY Before Every Commit

```bash
# Install all workspace deps from root
pnpm install

# Type-check all packages (uses Turborepo — cached, dependency-aware)
pnpm typecheck                                      # All packages (frontend + dashboard + shared)
pnpm exec turbo typecheck --filter=pop              # Frontend only
pnpm exec turbo typecheck --filter=dashboard        # Dashboard only

# Edge functions (Deno — not managed by Turbo)
cd supabase/functions && deno check <function>/index.ts
```

Never force-push. Never skip type-check.

## Game Config — The Source of All Balance Numbers

All tunable game balance (costs, XP thresholds, cooldowns, probabilities, etc.) lives in 10 JSONB rows in the `game_config` Supabase table. The system works as:

1. **Code defaults** in `shared/*.ts` (e.g. `BREED_BASE_PRICE_USD` in `shared/currency.ts`)
2. **Zod schemas** in `shared/schemas.ts` validate each config key
3. **`buildGameConfig()`** in `shared/gameConfig.ts` merges DB rows over code defaults — invalid rows log warnings and silently fall back to defaults
4. **Edge functions** fetch fresh config every request via `getGameConfig(supabase)` — **never cache**
5. **Frontend** fetches once at app start via `GameConfigProvider` (React Context)
6. **Dashboard** manages config via Zustand store with draft/save/revert pattern

**Rules**:
- Never hardcode balance numbers in edge functions or components — import from `shared/` and pass optional `cfg` override
- When adding a new config key: update `shared/schemas.ts` (Zod schema + defaults) AND `shared/gameConfig.ts` (FullGameConfig type)
- `@migration: KEEP` comments in shared/ mean the value is a structural invariant — never move to game_config
- `@migration: DELETE` means the value should migrate to game_config

## Type Safety

- `NFTType` = `'cruise-seat' | 'turbo-flush' | 'zen-fortress'` — not `string`
- `NFTRarity` = `'common' | 'rare' | 'legendary' | 'transcendent'` — not `string`
- When pulling from the DB, cast: `data.rarity as NFTRarity` — but prefer Zod validation at boundaries
- All formula functions accept optional typed `cfg` parameter for DB-overridden values:
  ```ts
  export function repairCost(level: number, rarity: NFTRarity, ..., cfg?: RepairCfg): number
  ```

## Ownership Checks — Every Mutation, Not Just Queries

Every database operation that reads or mutates user data MUST include `.eq('user_id', userId)`:

```ts
// ✅ Defence-in-depth: both SELECT and UPDATE check ownership
const { data } = await supabase.from('nfts').select('*').eq('id', nftId).eq('user_id', userId).single();
await supabase.from('nfts').update({ energy: 100 }).eq('id', nftId).eq('user_id', userId);

// ❌ NEVER trust just the NFT ID from the request body
const { data } = await supabase.from('nfts').select('*').eq('id', nftId).single(); // Missing user check
```

## Logging Convention (Edge Functions)

Always prefix with function name and include user context:
```ts
console.log('breed-nfts: user', userId);
console.log('breed-nfts: cost breakdown — parent1 (...) → $100, parent2 (...) → $150, total $250');
console.error('breed-nfts: fetch parents error', fetchError);
```

## HTTP Error Semantics (Edge Functions)

| Status | Meaning | When |
|---|---|---|
| `400` | Bad Request | Missing required fields, malformed input |
| `401` | Unauthorized | No/invalid auth token |
| `402` | Payment Required | Insufficient POOP balance |
| `404` | Not Found | NFT doesn't exist or not owned by user |
| `422` | Unprocessable Entity | Valid input but business rule violation (energy 0, breed limit, audio too short) |
| `429` | Rate Limit / Cooldown | Daily detection limit or NFT cooldown |
| `500` | Internal Server Error | DB fault, Cloud Run error, unexpected exception |

## Date/Time

- Postgres: always `TIMESTAMPTZ` (never `DATE` or `TIMESTAMP`)
- Migrations: `DEFAULT NOW()` (not `CURRENT_TIMESTAMP`)
- JavaScript: `new Date().toISOString()` when passing to DB

## Agent Sessions

Agent sessions run in isolated git worktrees (`.vscode/hooks.json`). The `SessionStart` hook creates a sibling directory (e.g. `${REPO_NAME}-task-<epochSeconds>-<pid>/`) with its own branch and working tree. The `Stop` hook removes the worktree. Agents must work inside the worktree path provided in `additionalContext` — never modify the original repo.

⚠️ **Terminal sharing**: Parallel sessions share the same VS Code terminal shell. **Every** terminal command MUST start with `cd <worktree_dir> &&` to avoid cwd races. Never assume the current directory is correct — another session may have changed it between your commands. For git operations, prefer `git -C <worktree_dir> <command>`.

## Branch Naming

`fix/`, `feat/`, `refactor/`, `chore/`, `docs/`, `ui/`, `ux/`, `perf/`, `security/`, `test/`, `tv/`, `heroui/` + kebab-case (e.g. `security/harden-cors-origins`). With issue: `security/42-harden-cors`.

## Commit Messages

`<prefix>: <description>` — prefix matches branch type. Include `Fixes #<n>` in body when closing an issue.

## PR Workflow

All agents follow a 4-phase workflow ending with PR creation and the `pr-review-handler` skill. See `.github/skills/pr-review-handler/SKILL.md`.

## Backlog

All backlog items are tracked as GitHub Issues. Key epics: #89 (Pre-launch security hardening), #90 (Shared NFT data layer). Use `gh issue list` or the GitHub Issues skill to discover work items.
