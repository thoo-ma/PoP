# Vet Log Spec

`vet-log.md` is written alongside the four category reports. It records every subagent finding that the main agent **dropped**, **re-scoped**, or **reprioritized** during Phase 3 vetting. It is a small operational file, not a deliverable — but it is the single most useful artifact for improving subagent prompts on the next run.

## When to write

Every time a subagent finding does not appear in a category report exactly as the subagent produced it. That includes:

- **Dropped** — the finding was removed entirely
- **Re-scoped** — the finding was kept but its category, severity, or subcategory changed
- **Merged** — the finding was folded into another finding
- **Split** — the finding was broken into multiple findings
- **Re-attributed** — the file:line or excerpt was corrected

Findings that pass vetting unchanged do not need log entries.

## Structure

Group entries by the subagent that produced the finding (four sections: architecture, design-system, performance, accessibility). Within each section, one entry per action.

```
# Vet Log

Repo: <repo name>
Commit: <short SHA>
Date: <ISO date>

## Architecture subagent

### Dropped

- **ARCH-005** — "Utils folder has no clear owner"
  Reason: by-design. The `utils/` folder is intentionally a shared surface documented in AGENTS.md.

- **ARCH-011** — "Auth service should be in a separate package"
  Reason: preference, not evidence. The current placement causes no observed friction. Not a finding.

### Re-scoped

- **ARCH-008** → severity `high` → `medium`
  Reason: subagent flagged the coupling as high-severity, but re-reading shows only two consumers and the coupling is stable. Real, but not high.

- **ARCH-014** → category `architecture` → `performance` (moved to PERF-021)
  Reason: finding is about context re-render risk, which is a perf concern. Handed to perf subagent's territory during synthesis.

## Design-system subagent

### Dropped

- **DS-006** — "Card component uses radius 10 instead of radius.md"
  Reason: unverifiable. Cited file `src/components/Card.tsx` does not contain `10` at line 34; actual value is `radii.md`. Subagent hallucinated the value.

### Merged

- **DS-009** and **DS-012** — both about inconsistent button heights
  Reason: same root cause. Kept DS-009, referenced DS-012 in its locations array.

## Performance subagent

### Re-attributed

- **PERF-003** — evidence file:line corrected
  Reason: subagent cited `InventoryList.tsx:42-58`, actual pattern is at `InventoryList.tsx:71-89`. Finding is real; pointer was off.

## Accessibility subagent

(no changes — all findings passed vetting)
```

## Categorical reasons

Use these short labels to keep the log parseable across runs:

- **by-design** — the flagged behavior is intentional, documented, or platform convention.
- **preference** — style opinion without concrete evidence of harm.
- **unverifiable** — the cited file:line or excerpt does not match what is actually there.
- **out-of-scope** — real, but belongs to another category or is outside the skill's remit.
- **duplicate** — same finding under a different ID; merged.
- **low-signal** — real but confidence-low and impact-low; not worth reporting.
- **over-scored** / **under-scored** — severity, effort, or fix_risk adjusted.
- **stale-excerpt** — finding real, excerpt or line numbers corrected.

One label per action; if multiple apply, pick the most consequential.

## What not to log

- Findings that passed vetting unchanged. Do not clutter the log with "confirmed" entries.
- Findings that the subagent explicitly noted as low-confidence and the main agent agreed to drop — those are the format working as intended.
- Your own new findings added during synthesis (those go in the relevant category report, not here).

## Why this file matters

Two reasons.

**First**, it makes the drop rate visible. If a subagent's `unverifiable` rate is high, its prompt needs tighter constraints on file reading. If a subagent's `by-design` rate is high, its playbook needs a stronger "not a finding" section for that category.

**Second**, it protects against silent revisionism. When a stakeholder asks "why isn't X in the report?" — the log answers, with the reason, in a form that can be re-read and re-argued. Drops without a paper trail become drops nobody trusts.

Keep entries short. One line for the label, one to two lines for the reason. This is a log, not a debate.