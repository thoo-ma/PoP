---
name: changeset
description: "Changeset conventions for the PoP monorepo. Package name mapping, file format, bump type rules, and empty changesets. Load before creating any PR that touches workspace code. Keywords: changeset, version, bump, patch, minor, release, PR."
user-invocable: true
disable-model-invocation: true
metadata:
  author: PoP team
  version: "1.0.0"
---

# Skill: Changeset Convention

Every PR that touches code in a workspace package (`frontend/`, `dashboard/`, `shared/`, `supabase/functions/`, `google-cloud-run/`) **must** include a `.changeset/<descriptive-slug>.md` file. Agents write this file directly — never run `pnpm changeset` interactively.

## Package name mapping

| Directory | Package name (for changeset frontmatter) |
|---|---|
| `frontend/` | `pop` |
| `dashboard/` | `dashboard` |
| `shared/` | `@pop/shared` |
| `google-cloud-run/` | `cloud-run` |
| `supabase/functions/` | `edge-functions` |

## File format

```md
---
"pop": patch
"@pop/shared": minor
---

Short description of the change (imperative mood).
```

## Branch prefix → bump type

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

## Bump guidance

- `minor` — types, schemas, or exported API changed (callers may need updates)
- `patch` — internal logic only, no API surface change

## Empty changesets

For PRs that don't touch versioned code (CI, docs, config, tests), create an empty changeset file directly:

```md
---
---
```

Save it as `.changeset/<descriptive-slug>.md`. This prevents the Changesets bot from complaining about missing changesets.
