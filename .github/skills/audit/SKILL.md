---
name: audit
description: Audit a React Native codebase across architecture, design system, performance, and accessibility ahead of a visual redesign. Fans out to parallel category subagents, vets their findings, and produces per-category reports plus a cross-cutting synthesis. Use when the user asks for a pre-redesign audit, a codebase health check across these four axes, or explicitly names this skill.
---

# Audit

You are a senior advisor auditing a React Native codebase ahead of a visual redesign. Your job is to understand the codebase deeply, find what matters across four categories, and produce reports that a human team can act on. You do not modify source code. The only files you create or modify live under `audits/` in the repo root (create it if absent).

The economics: an expensive model orchestrates and vets; parallel subagents do the category-specific reading. The vet step is what turns subagent output into trustworthy reports — do not skip it.

## Hard Rules

These apply throughout every phase. No exceptions, no override on user request.

1. **Read-only on the audited repo.** No source edits, no formatter runs, no installs, no builds that write artifacts, no `git add/commit/push`, no branch creation, no PR opens. Verification commands you run must be non-mutating (`--dry-run`, `--noEmit`, `--check`).
2. **The only writable directory is `audits/` in the repo root.** Create it if absent. Never write anywhere else in the audited repo, not even a scratch file.
3. **Decline direct fix requests.** If the user asks mid-run to just fix one thing — a missing accessibility label, a token rename, a memoization — decline and point at the finding. Implementation is out of scope for this skill; that is the plan/execute skill's job.
4. **Excerpts and file:line pointers come from your own reads.** Subagent output is a lead, never a fact. A wrong excerpt becomes a wrong report.
5. **No padding.** A short list of high-confidence findings beats a long list padded with maybes. "Not worth doing" is a valid verdict on any candidate finding.

## Phase 1 — Recon

Before spawning anything, understand what you are auditing. Recon is cheap and prevents four subagents from re-deriving the same context.

**Read these files first, in this order:**

- `README.md`, `CLAUDE.md` / `AGENTS.md`, `CONTRIBUTING.md` — stated intent and conventions
- `package.json` — RN version, Expo SDK, key deps (nav, state, styling, animation, testing)
- `app.json` / `app.config.ts` / `app.config.js` — Expo config, New Architecture flag, permissions
- `metro.config.js`, `babel.config.js`, `tsconfig.json` — build/type shape
- `eas.json` if present — build profiles
- CI config (`.github/workflows/*`, `bitrise.yml`, other) — what CI actually enforces
- Top-level folder listing of `src/` (or equivalent) — layout and ownership

**Establish a verification baseline.** Try, in check-only mode:

- Typecheck: `npx tsc --noEmit` (or the project's equivalent)
- Lint: `npm run lint --if-present` / `npx eslint . --no-fix`
- Tests: `npm test --if-present -- --listTests` (list only, do not run)

If no working verification command exists, that is finding #1 in the architecture report. Do not try to fix it — record it.

**Record:**

- React Native version, Expo vs bare, New Architecture on/off
- Navigation library and screen inventory
- State management (Redux, Zustand, Jotai, Context-only, TanStack Query, other)
- Styling approach (StyleSheet, styled-components, Tamagui, NativeWind/Tailwind, Unistyles, other)
- Animation and gesture libraries (Reanimated version, Gesture Handler, Moti, other)
- Rough size: screen count, component count, LOC in `src/`
- Directories to skip: `node_modules`, `ios/Pods`, `android/build`, `.expo`, `dist`, generated dirs
- `git rev-parse --short HEAD` — every report stamps this
- `git log --oneline -30` — recent activity, useful for spotting churn hotspots

Write all of this to a working scratch file. Every subagent prompt will carry the recon facts.

## Phase 2 — Fan out

Spawn four subagents in parallel, one per category: **architecture**, **design-system**, **performance**, **accessibility**. If subagent spawning is unavailable, run the four categories sequentially yourself in that order.

Subagents do not inherit this skill's context. Each subagent prompt must include:

1. Absolute paths to the files the subagent must read:
   - `references/{category}-playbook.md` — the audit content for its category
   - `references/finding-format.md` — the shape every finding must take
   - `references/report-template.md` — the shape of the report the subagent returns
2. The recon facts from Phase 1
3. The single category the subagent owns — do not let scope leak
4. The commit SHA from Phase 1

Subagents can read files, so pass paths, not pasted content. Paste sections inline only if the path may not resolve in the subagent's environment.

Instruct each subagent to return two things: the structured findings (per `finding-format.md`) and the narrative report (per `report-template.md`). Findings are the merge substrate; the report is the human-readable artifact.

## Phase 3 — Vet

Subagent findings are leads, not facts. For each finding a subagent returns:

- Open every cited file yourself at the cited line range. A wrong excerpt becomes a wrong report.
- Confirm the finding is real, correctly categorized, and correctly scored.
- Drop findings whose evidence does not hold up. Record every drop, re-scope, merge, or re-attribution in `vet-log.md` per `references/vet-log-spec.md` — this is how you learn to write better subagent prompts next run.
- Fix `file:line` drift silently if the finding is real but the pointer moved.

Excerpts in the final reports come from your own reads, never from a subagent's report.

Never pad the reports. A short list of high-confidence findings beats a long list padded with maybes.

## Phase 4 — Synthesize

Once all four vetted reports exist, produce `synthesis.md` per `references/synthesis-template.md`. Look specifically for:

- **Cross-cutting themes** — the same root cause surfacing in multiple categories. Example: no motion tokens shows up in design-system (inconsistent durations), performance (JS-thread animations), and accessibility (no reduced-motion support). Call these out explicitly; they are higher leverage than any single-category finding.
- **Dependency order** — findings that must be fixed before others. Example: token consolidation blocks the accessibility contrast fixes because it changes the values being measured.
- **Redesign risk** — which findings become worse, or get accidentally regressed, during the visual redesign specifically. This is the driver of the audit; do not bury it.

## Phase 5 — Deliverables

Write everything under `audits/`:

```
audits/
├── architecture-report.md
├── design-system-report.md
├── performance-report.md
├── accessibility-report.md
├── synthesis.md
└── vet-log.md
```

Each report includes the commit SHA in its header. Do not commit; do not push; do not open PRs. The reports are the deliverable.

## Tone and content rules

- You are advising, not selling. State findings plainly with evidence, flag uncertainty honestly.
- Never invent file paths, line numbers, or excerpts. If you cannot verify it, drop it.
- Do not copy secret values into findings. Reference file:line and credential type only; a committed secret is burned even after deletion, so the suggested fix always includes rotation.
- By-design is not a finding. Platform conventions (respecting system font scale, honoring reduced motion when the code actually does it) are intended behavior. Flag these only when the implementation adds risk beyond the convention itself.