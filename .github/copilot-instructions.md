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

# Format & lint with Biome (covers frontend/, shared/, dashboard/src/)
pnpm format                                         # Auto-fix formatting
pnpm lint                                           # Lint (biome lint .)

# Edge functions (Deno — not managed by Turbo or Biome)
cd supabase/functions && deno check <function>/index.ts
```

Never force-push. Never skip type-check.

## Game Config

All tunable game balance lives in the `game_config` Supabase table (JSONB key-value, 1 row per mechanic). Code defaults in `shared/` are merged with DB rows at runtime. Never hardcode balance numbers — see `shared/.instructions.md` for schema conventions and the `cfg` parameter pattern, `supabase/.instructions.md` for the seed migration pattern.

## Type Safety

- `NFTType` = `'cruise-seat' | 'turbo-flush' | 'zen-fortress'` — not `string`
- `NFTRarity` = `'common' | 'rare' | 'legendary' | 'transcendent'` — not `string`
- When pulling from the DB, prefer Zod validation at boundaries over manual casting

## Date/Time

- Postgres: always `TIMESTAMPTZ` (never `DATE` or `TIMESTAMP`)
- Migrations: `DEFAULT NOW()` (not `CURRENT_TIMESTAMP`)
- JavaScript: `new Date().toISOString()` when passing to DB

## Branch Naming

`fix/`, `feat/`, `refactor/`, `chore/`, `docs/`, `ui/`, `ux/`, `perf/`, `security/`, `test/`, `tv/`, `heroui/` + kebab-case (e.g. `security/harden-cors-origins`). With issue: `security/42-harden-cors`.

## Commit Messages

`<prefix>: <description>` — prefix matches branch type. Include `Fixes #<n>` in body when closing an issue.

## Changeset Convention

Every PR that touches code in a workspace package (`frontend/`, `dashboard/`, `shared/`, `supabase/functions/`) **must** include a `.changeset/<descriptive-slug>.md` file. Agents write this file directly — never run `pnpm changeset` interactively.

### File format

```md
---
"pop": patch
"@pop/shared": minor
---

Short description of the change (imperative mood).
```

### Branch prefix → bump type

| Branch prefix | Bump type |
|---|---|
| `feat/` | `minor` |
| `fix/` | `patch` |
| `security/` | `patch` |
| `refactor/` | `patch` |
| `ui/`, `ux/` | `patch` |
| `perf/` | `patch` |
| `heroui/`, `tv/` | `patch` |
| `chore/`, `docs/`, `test/` | create an empty changeset file |

### `@pop/shared` bump guidance

- `minor` — types, schemas, or exported API changed (callers may need updates)
- `patch` — internal logic only, no API surface change

### Empty changesets

For PRs that don't touch versioned code (CI, docs, config, tests), create an empty changeset file directly:

```md
---
---
```

Save it as `.changeset/<descriptive-slug>.md`. This prevents the Changesets bot from complaining about missing changesets.

## PR Workflow

All agents follow a 4-phase workflow ending with PR creation and the `pr-review-handler` skill. See `.github/skills/pr-review-handler/SKILL.md`.

## Skills

<skills>
<skill>
<name>operations</name>
<description>Deployment pipelines, CI/CD workflows, GitHub Environments, secrets management, release process (Changesets), milestone releases, emergency rollback procedures, and cost monitoring. Use when working on GitHub Actions, deployment automation, infrastructure, or incident response. Keywords: deploy, release, CI, CD, workflow, rollback, environment, secrets, pipeline, EAS, Cloud Run, Vercel, Supabase, milestone.</description>
<file>.github/skills/operations/SKILL.md</file>
</skill>
</skills>

## Backlog

All backlog items are tracked as GitHub Issues. Key epics: #89 (Pre-launch security hardening), #90 (Shared NFT data layer). Use `gh issue list` or the GitHub Issues skill to discover work items.
