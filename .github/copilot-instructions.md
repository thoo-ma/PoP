# PoP — Coding Standards

> **Owner**: `thoo-ma` · **Repo**: `PoP` · **Monorepo** with 5 areas, each has its own `.instructions.md` with area-specific rules. This file contains cross-cutting rules that apply everywhere.

PoP is an NFT-based mobile game where players earn POOP tokens by detecting real-world toilet flushes via on-device audio classification.

## Monorepo Layout

**pnpm workspaces** — single root `pnpm-lock.yaml`, run `pnpm install` from root.

| Directory | Runtime | Key Dependency |
|---|---|---|
| `frontend/` | React Native + Expo | HeroUI Native, Uniwind (Tailwind v4) |
| `dashboard/` | Next.js (App Router) | Radix UI, Tailwind v3, Zustand |
| `shared/` | `@pop/shared` workspace package — raw TS, no build step | Zod |
| `supabase/` | Deno (Edge Functions) | Supabase JS, Zod |
| `google-cloud-run/` | Python + Flask | TensorFlow, YAMNet |

## Build & Validate

**Husky git hooks** automate formatting, linting, and type-checking so you don't have to run them manually:

| Hook | What runs | Trigger |
|---|---|---|
| `pre-commit` | `pnpm biome check --staged --write --no-errors-on-unmatched` — auto-fixes formatting and lints staged files (<1 s) | Every `git commit` |
| `pre-push` | `pnpm typecheck` — Turborepo-cached full type-check across all workspaces | Every `git push` |

Hooks are installed automatically when you run `pnpm install` (via the `prepare` script). If hooks are missing, re-run `pnpm install` from the repo root.

Ad-hoc: `pnpm typecheck` (all packages), `pnpm format` (Biome). Edge functions: `cd supabase/functions && deno check <function>/index.ts`.

Never force-push. Never use `--no-verify` to bypass hooks.

## Conventions

- Use discriminated union types (`NFTType`, `NFTRarity`) from `@pop/shared` — never `string`
- Prefer Zod validation at system boundaries over manual casting
- JavaScript: `new Date().toISOString()` when passing dates to DB

## Branch Naming

`fix/`, `feat/`, `refactor/`, `chore/`, `docs/`, `ui/`, `ux/`, `perf/`, `security/`, `test/`, `tv/`, `heroui/`, `config/` + kebab-case (e.g. `security/harden-cors-origins`). With issue: `security/42-harden-cors`.

## Commit Messages

`<prefix>: <description>` — prefix matches branch type. Include `Fixes #<n>` in body when closing an issue.

## Changeset Convention

Every PR that touches workspace code **must** include a changeset. Load `.github/skills/changeset/SKILL.md` for package name mapping, file format, bump rules, and empty changesets.

## Area-File Template

Each area's `.instructions.md` follows this canonical H2 structure:

1. `## Runtime & Dependencies` — language, framework, key libraries
2. `## Code Organization` — folder layout, path aliases, navigation/routing
3. `## Patterns` — conventions, recipes, idioms (use `### Subsections` per topic)
4. `## Pitfalls` — "do not" rules, cross-area warnings, common mistakes
5. `## Skills & Agents` — pointers to relevant skills (and agents, if any)

Maintain this order. Add new content under an existing `### Subsection` of `## Patterns` rather than introducing a new top-level H2.

## Skills

<skills>
<skill>
<name>operations</name>
<description>Deployment pipelines, CI/CD, secrets, release process, rollback.</description>
<file>.github/skills/operations/SKILL.md</file>
</skill>
<skill>
<name>game-config</name>
<description>Game balance config-as-code reference. Config key map, formulas, Zod schemas, invariants.</description>
<file>.github/skills/game-config/SKILL.md</file>
</skill>
<skill>
<name>heroui-native</name>
<description>HeroUI Native component library for React Native.</description>
<file>.github/skills/heroui-native/SKILL.md</file>
</skill>
<skill>
<name>tailwind-variants</name>
<description>Tailwind-variants (tv) style extraction for React Native.</description>
<file>.github/skills/tailwind-variants/SKILL.md</file>
</skill>
<skill>
<name>uniwind</name>
<description>Uniwind — Tailwind CSS v4 styling for React Native.</description>
<file>.github/skills/uniwind/SKILL.md</file>
</skill>
<skill>
<name>turborepo</name>
<description>Turborepo monorepo build system guidance.</description>
<file>.github/skills/turborepo/SKILL.md</file>
</skill>
<skill>
<name>pr-review-handler</name>
<description>Handle Copilot code review comments on a PR.</description>
<file>.github/skills/pr-review-handler/SKILL.md</file>
</skill>
<skill>
<name>github-issues</name>
<description>GitHub issues management: label taxonomy, title conventions, epic patterns. Load before creating or updating any issue.</description>
<file>.github/skills/github-issues/SKILL.md</file>
</skill>
<skill>
<name>changeset</name>
<description>Changeset conventions: package name mapping, file format, bump rules.</description>
<file>.github/skills/changeset/SKILL.md</file>
</skill>
</skills>

## Agents

No agents are currently registered in `.github/agents/`. To add one: place `<name>.agent.md` in `.github/agents/`, use any file under `.github/skills/` as a format reference, and register the entry in the `<agents>` block below.

<agents>
<agent>
<name>Frontend Debug</name>
<description>Debug React Native frontend issues in `frontend/`: Expo app regressions, UI glitches, navigation or state bugs, React Query data problems, and screen-level failures. Conservative, question-driven, and narrowly validated.</description>
<file>.github/agents/frontend-debug.agent.md</file>
</agent>
</agents>

