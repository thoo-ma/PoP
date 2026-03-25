---
name: github-issues
description: "GitHub issues management conventions for the PoP monorepo. Use when creating, updating, labeling, or triaging GitHub issues. Covers the label taxonomy (type, scope, priority, size, structure), issue title conventions, epic patterns, and assignment rules. Keywords: GitHub issues, labels, triage, epic, priority, scope, type, size."
user-invocable: true
disable-model-invocation: true
metadata:
  author: PoP team
  version: "1.0.0"
---

# Skill: GitHub Issues Management

Conventions for creating, labeling, and managing GitHub issues in the PoP monorepo (owner: `thoo-ma`, repo: `PoP`).

**Every agent that creates or edits issues MUST follow these rules.**

---

## Label Taxonomy

Every issue receives **at minimum**: 1 type + 1 scope + 1 priority.
Epics also get the `epic` label. Sized issues also get 1 size.

### Type (required — pick exactly one)

| Label | Color | When to use |
|---|---|---|
| `type: bug` | red `#d73a4a` | Something isn't working — crash, incorrect behavior, regression |
| `type: feature` | green `#0e8a16` | New capability or enhancement — user-facing or internal |
| `type: refactor` | blue `#1d76db` | Code improvement with no behavior change — extraction, restructuring, DRY |
| `type: chore` | light blue `#bfd4f2` | Maintenance — deps, CI, tooling, linting, test infrastructure |
| `type: docs` | doc blue `#0075ca` | Documentation only — READMEs, comments, guides |

### Scope (required — pick one or more)

| Label | Color | Maps to |
|---|---|---|
| `scope: frontend` | light green `#c2e0c6` | `frontend/` — React Native app |
| `scope: dashboard` | lavender `#d4c5f9` | `dashboard/` — Next.js admin |
| `scope: shared` | cream `#fef2c0` | `shared/` — @pop/shared package |
| `scope: supabase` | supabase green `#3ecf8e` | `supabase/` — Edge functions & migrations |
| `scope: cloud-run` | salmon `#f9d0c4` | `google-cloud-run/` — Python ML service |
| `scope: infra` | gray `#e6e6e6` | CI/CD, monorepo config, tooling, deployment |

Cross-cutting issues get multiple scope labels (e.g. `scope: supabase` + `scope: shared`).

### Priority (required — pick exactly one)

| Label | Color | Meaning | BACKLOG tier |
|---|---|---|---|
| `priority: critical` | dark red `#b60205` | Pre-launch blocker, security vulnerability, data loss risk | Tier 1 |
| `priority: high` | orange `#d93f0b` | Should be done soon — significant impact or dependency | Tier 2–3 |
| `priority: medium` | yellow `#fbca04` | Normal priority — valuable but not urgent | Tier 4–5 |
| `priority: low` | light green `#c2e0c6` | Nice to have — polish, cleanup, post-launch | Tier 6–7 |

### Size (recommended — pick exactly one)

| Label | Color | Meaning |
|---|---|---|
| `size: XS` | `#ededed` | < 1 hour — typo fix, config tweak |
| `size: S` | `#d4d4d4` | 1–4 hours — single-file fix, small feature |
| `size: M` | `#bababa` | 1–2 days — multi-file change, moderate complexity |
| `size: L` | `#a0a0a0` | 3–5 days — significant feature, cross-cutting refactor |
| `size: XL` | `#878787` | 1+ week — epic-level effort, new subsystem |

### Structure (when applicable)

| Label | Color | When to use |
|---|---|---|
| `epic` | indigo `#3E4B9E` | Parent tracking issue that has sub-issues |
| `blocked` | light red `#e99695` | Waiting on another issue to be resolved first |

---

## Issue Title Conventions

### Do

- Use plain descriptive English: "Add unit tests for shared/ pure functions"
- Be specific: "Fix Zod version mismatch (v3 in shared/frontend vs v4 in dashboard)"
- Include context parentheticals when helpful: "Landing page (Astro + GitHub Pages)"

---

## Epic Conventions

Epics are parent tracking issues that break down into sub-issues.

1. Add the `epic` label
2. List sub-issues in the body using GitHub's task list or sub-issue syntax
3. Include an overview, goals, and decisions section
4. Sub-issues should reference the parent: "Part of #<epic-number>" in their body
5. Give epics `size: XL` (they are always large by definition)

### Blocking & Dependencies

When sub-issues must be executed sequentially (i.e. one depends on another):

1. Add the `blocked` label to every sub-issue that cannot start yet
2. State the dependency explicitly in the body: "Depends on #<number>"
3. When the blocking issue is resolved, remove the `blocked` label from the next issue in the chain
4. Only the **first** sub-issue in a dependency chain should be unblocked at creation time

---

## Creating Issues from Agents

When an agent discovers a new bug, improvement opportunity, or follow-up work during its session, it should create an issue using the GitHub MCP tools with proper labels.

### Template

```markdown
## Context

<Why this issue exists — what was discovered, what triggered it>

## What

- [ ] <Actionable task 1>
- [ ] <Actionable task 2>

## Files

- **Modify**: `path/to/file.ts`
- **Create**: `path/to/new-file.ts` (if applicable)

## Acceptance criteria

- <Measurable outcome 1>
- <Measurable outcome 2>
```

### Label selection logic for agents

```
if the issue is a crash or incorrect behavior → type: bug
if the issue adds new capabilities → type: feature
if the issue restructures code without behavior change → type: refactor
if the issue is about deps, CI, tooling, tests → type: chore

scope = whichever directories are affected (can be multiple)

if it blocks launch or is a security hole → priority: critical
if it has significant impact → priority: high
if it's normal work → priority: medium
if it's polish / nice-to-have → priority: low
```

---

## Branch Naming (cross-reference)

Branch prefixes must match the issue type:

| `type:` label | Branch prefix |
|---|---|
| `type: bug` | `fix/` |
| `type: feature` | `feat/` |
| `type: refactor` | `refactor/` |
| `type: chore` | `chore/` |
| `type: docs` | `docs/` |

With issue number: `fix/42-broken-nft-card` or `feat/76-dashboard-save`


