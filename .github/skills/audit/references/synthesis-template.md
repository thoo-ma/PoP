# Synthesis Template

`synthesis.md` is the final artifact of a redesign audit. It reads across all four category reports and surfaces what is only visible from the outside — cross-cutting themes, dependency order, and the redesign readiness verdict that no single category can render alone.

Do not restate the category reports. If a reader wants per-category depth they open the per-category file. Synthesis is about the *view from above*.

## When to write this file

After all four category reports (`architecture-report.md`, `design-system-report.md`, `performance-report.md`, `accessibility-report.md`) are written and vetted. Not before. The synthesis reads the findings YAML from each report, not the prose narrative.

## Structure

### Header

```
# Redesign Audit — Synthesis

Repo: <repo name>
Commit: <short SHA>
Date: <ISO date>
Category reports: architecture, design-system, performance, accessibility
Total findings: <count> (across 4 categories after vetting)
```

### 1. Executive summary

Three to five sentences. What the codebase is, what state it is in across the four dimensions, and whether the redesign can proceed. The verdict from section 5 stated once, in plain language.

A busy reader who reads only this section should come away with an accurate picture of what needs to happen and roughly how much of it there is.

### 2. Cross-cutting themes

The most important section. Themes are root causes whose symptoms surface in multiple categories. Fixing them once resolves several findings; not seeing them means fixing symptoms one by one and never addressing the root.

For each theme:

- **Name** — one short phrase (e.g. "No motion tokens", "Styling engine runtime cost", "Inconsistent focus management")
- **Findings it explains** — list of finding IDs across the four reports (e.g. `DS-007, PERF-011, A11Y-014`)
- **Root cause** — one paragraph on what is actually going on underneath the symptoms
- **Leverage** — why fixing the theme is higher-leverage than fixing its symptoms individually
- **Direction** — sketch of the systemic fix. Not a plan. What kind of intervention.

Look for themes in these common shapes:

- **A missing token category** surfacing as design inconsistency, perf issues (untokenized runtime styles), and a11y issues (untokenized contrast, no reduced-motion respect) at once.
- **A wrong-level abstraction** where the same friction shows up in architecture (state model), design system (component contracts), and perf (over-rendering) — usually a Context or store that is doing too much.
- **A missing primitive** (no `Text` component wrapping typography roles, no `Pressable` wrapper handling a11y+touch+haptics) causing every screen to reinvent the same three fixes inconsistently.
- **Platform-parity gap** where iOS and Android behavior differ in ways that surface across a11y, perf, and design system reports.
- **A frozen or half-migrated pattern** where old code and new code coexist and every category audit flags the same drift line.

Two to five themes is the sweet spot. Zero themes means either the codebase is genuinely well-factored (say so plainly) or the synthesis was rushed. More than five usually means themes are being invented; consolidate.

### 3. Merged priority list

The top ~15 findings across all four categories, re-ordered by the leverage rubric from `finding-format.md`. This overrides any single-category prioritization when they conflict.

Ordering rules, in priority:

1. Findings that appear as symptoms of a cross-cutting theme sort by the theme's rank, not their own.
2. `redesign_risk: direct` before `incidental` before `none`.
3. Higher confidence before lower confidence.
4. `severity` × `redesign_risk` ÷ `effort`, discounted by `fix_risk`.
5. Break ties toward lower `fix_risk` (safer to ship).

Table format:

| Rank | ID | Category | Title | Severity | Effort | Fix risk | Redesign risk | Blocks redesign |
|------|-----|----------|-------|----------|--------|----------|---------------|-----------------|
| 1 | DS-014 | design-system | Motion tokens missing | high | M | low | direct | yes |
| 2 | A11Y-007 | a11y | Modal focus not managed | high | S | low | direct | yes |
| … | | | | | | | | |

Under the table, one paragraph explaining any ordering choices that are non-obvious.

### 4. Dependency order

Some findings must be fixed before others. This is not the same as the priority list — priority is about leverage, dependencies are about sequence.

Common shapes:

- **Token consolidation before contrast fixes.** If design-system findings call for tokenizing colors, a11y contrast findings against the untokenized values will change targets when tokens land.
- **List item memoization before list restyling.** If perf findings call for memoizing list items, design-system changes to those items will fight the memoization boundaries.
- **State model change before component splits.** If architecture findings call for moving state out of a component, design-system findings about that component's contract cannot land cleanly first.

Diagram it as a simple ordered list or a two-column "before → after" list. Do not overengineer with a full graph unless the codebase genuinely warrants it.

### 5. Redesign readiness verdict

The single question the audit exists to answer: **can the redesign proceed, and if so under what conditions?**

Pick exactly one:

- **Ready** — proceed. Address findings on their own schedule alongside redesign work.
- **Ready with preparation** — proceed after a bounded prep phase. List the exact finding IDs (and any themes) that must land first. Estimate the prep phase in weeks.
- **Redesign requires structural work first** — do not start the redesign yet. List the structural blockers (themes and/or findings) that must be addressed before redesign work can land cleanly. Estimate.
- **Redesign is premature** — the codebase is too early or too unstable for a redesign to make sense right now. Explain what would need to be true for a redesign to become worthwhile.

The verdict is not a category average. A codebase with excellent architecture, performance, and design system but severe a11y gaps might still be "Ready with preparation" — the a11y prep phase is bounded and does not block the redesign structurally. A codebase with a good a11y layer but a broken styling engine might be "Redesign requires structural work" — the redesign cannot land on that engine.

One paragraph of justification. Name the specific evidence.

### 6. What the audit did not cover

Honest limits. Anything the four category playbooks intentionally leave out (build tooling, CI, testing depth, backend contracts beyond client-side shapes), plus anything you could not verify (features behind flags, screens not in the current build, platform behavior not exercised in your reads).

This section prevents the audit from being read as more comprehensive than it is.

## Writing rules

- No new findings in the synthesis. Every claim traces to an ID in one of the four category reports. If you find a new one during synthesis, add it to the relevant category report first, then reference it here.
- No hedging on the verdict. Pick one of the four outcomes and defend it. "Ready but also not quite" is not a verdict.
- Themes are earned, not asserted. A theme claim without ≥ 3 finding IDs from ≥ 2 categories underneath it is not a theme; it is a single-category finding wearing a hat.
- The synthesis is short. Executive summary + themes + priority table + dependencies + verdict + limits should fit in roughly 400–800 lines including the finding table. If you are over that, you are restating category reports.
- Written for a decision-maker who has five minutes. Everything else is a click away in the category files.