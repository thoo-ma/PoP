# PoP — Coding Standards

> **Owner**: `thoo-ma` · **Repo**: `PoP` · **Monorepo** with 5 areas, each has its own `.instructions.md` with area-specific rules. This file contains cross-cutting rules that apply everywhere.

## Monorepo Layout

**pnpm workspaces** — single root `pnpm-lock.yaml`, run `pnpm install` from root.

| Directory | Runtime | Key Dependency | Path Alias |
|---|---|---|---|
| `frontend/` | React Native + Expo 54 | HeroUI Native, Uniwind (Tailwind v4) | `@/*` → `./` · `@pop/shared` (workspace) |
| `dashboard/` | Next.js 15 (App Router) | Radix UI, Tailwind v3, Zustand | `@/*` → `./src/*` · `@pop/shared` (workspace) |
| `shared/` | `@pop/shared` workspace package — raw TS, no build step | Zod | — |
| `supabase/` | Deno (Edge Functions) | Supabase JS v2, Zod | Relative: `../../../shared/` |
| `google-cloud-run/` | Python 3.10 + Flask | TensorFlow, YAMNet | — |

⚠️ **frontend/ uses Tailwind v4 (Uniwind)**. **dashboard/ uses Tailwind v3**. They are NOT interchangeable. Do not copy styling patterns between them.

## Build & Validate

**Husky git hooks** automate formatting, linting, and type-checking so you don't have to run them manually:

| Hook | What runs | Trigger |
|---|---|---|
| `pre-commit` | `pnpm biome check --staged --write --no-errors-on-unmatched` — auto-fixes formatting and lints staged files (<1 s) | Every `git commit` |
| `pre-push` | `pnpm typecheck` — Turborepo-cached full type-check across all workspaces | Every `git push` |

Hooks are installed automatically when you run `pnpm install` (via the `prepare` script). If hooks are missing, re-run `pnpm install` from the repo root.

### Manual commands (ad-hoc use)

These are the same checks the hooks run. Use them when you want to validate without committing/pushing:

```bash
pnpm install                                            # Install all workspace deps from root

pnpm typecheck                                          # Type-check all packages (Turborepo — cached)
pnpm exec turbo run typecheck --filter=pop              # Frontend only
pnpm exec turbo run typecheck --filter=dashboard        # Dashboard only

pnpm format                                             # Auto-fix formatting (Biome)
pnpm lint                                               # Lint (biome lint .)

# Edge functions (Deno — not managed by Turbo, Biome, or Husky)
cd supabase/functions && deno check <function>/index.ts
```

Never force-push. Never skip type-check. Never use `--no-verify` to bypass hooks unless in an emergency — CI is the final safety net, not a substitute for local validation.

## Game Config

All tunable game balance lives as exported constants in `shared/` modules (config-as-code). Formula functions accept an optional `cfg?` parameter with `??` fallback to module constants — see `shared/.instructions.md` for the pattern.

## Type Safety

- `NFTType` = `'cruise-seat' | 'turbo-flush' | 'zen-fortress'` — not `string`
- `NFTRarity` = `'common' | 'rare' | 'legendary' | 'transcendent'` — not `string`
- When pulling from the DB, prefer Zod validation at boundaries over manual casting

## Date/Time

- Postgres: always `TIMESTAMPTZ` (never `DATE` or `TIMESTAMP`)
- Migrations: `DEFAULT NOW()` (not `CURRENT_TIMESTAMP`)
- JavaScript: `new Date().toISOString()` when passing to DB

## Branch Naming

`fix/`, `feat/`, `refactor/`, `chore/`, `docs/`, `ui/`, `ux/`, `perf/`, `security/`, `test/`, `tv/`, `heroui/`, `config/` + kebab-case (e.g. `security/harden-cors-origins`). With issue: `security/42-harden-cors`.

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
| `config/` | `patch` |
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
<skill>
<name>game-config</name>
<description>Game balance config-as-code reference. Maps all 11 config keys to their source files, formula functions, Zod schemas, consumers, structural invariants, and semantic constraints. Use when tuning game balance, reviewing config changes, or understanding downstream impact of constant edits in shared/*.ts. Keywords: game config, balance, tuning, constants, economy, cooldown, XP, currency, breed, loot, degen bar, energy drain, minting, stat points, sensors.</description>
<file>.github/skills/game-config/SKILL.md</file>
</skill>
</skills>

## Agents

<agents>
<agent>
<name>config-tuner</name>
<description>Tune game balance constants in shared/*.ts via natural-language requests or GitHub issues. Mandatory preview before editing. 4-phase workflow: Research → Preview+Confirm → Implement+Verify → PR+Review. Keywords: config, balance, tuning, game config, constants, economy, buff, nerf, rebalance.</description>
<file>.github/agents/config-tuner.agent.md</file>
</agent>
</agents>

## GitHub Issues

Before creating or updating any GitHub issue, load `.github/skills/github-issues/SKILL.md` for label taxonomy, title conventions, and epic patterns.
