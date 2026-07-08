# Finding Format

Every finding a subagent returns follows this exact shape. This is the merge contract: the main agent aggregates findings across four categories, so the fields, values, and severity scale must be identical everywhere.

If a subagent cannot fill a required field with real evidence, the finding does not exist. Do not fabricate. Do not pad. Do not hedge with "possibly" or "might."

## Schema

```yaml
id: <category-prefix>-<zero-padded-int>   # ARCH-001, DS-014, PERF-007, A11Y-023
category: architecture | design-system | performance | accessibility
subcategory: <free text matching a section header in the category playbook>
title: <one line, imperative or descriptive, under 90 chars>
severity: critical | high | medium | low
locations:
  - path: <repo-relative path>
    lines: <start>-<end>       # single line: "42-42"
    excerpt: |
      <1-5 lines verbatim, only when the pattern is not obvious from file:line alone. Omit when a one-line description in `evidence` is enough.>
  # additional locations for the same finding go here
evidence: |
  <2-4 sentences explaining what is at that location and why it matches the finding>
impact: |
  <2-4 sentences: what breaks, for whom, under what conditions. Fold in redesign interaction here if relevant.>
redesign_risk: none | incidental | direct
effort: S | M | L                  # S: hours, M: a day-ish, L: multi-day
fix_risk: low | medium | high      # risk that the fix itself destabilizes something else
suggested_fix: |
  <sketch, not a plan. What direction, not step-by-step. 2-5 sentences.>
confidence: high | medium | low
```

## Severity scale

Use the same scale across all four categories. Severity is about user or team impact, not effort to fix.

- **critical** — causes crashes, data loss, blocks assistive-tech users entirely, or makes the redesign impossible without addressing it first. Rare. If more than ~5% of findings are critical, you are inflating.
- **high** — measurable degradation in normal use: frame drops users notice, screen-reader users significantly worse off, structural coupling that will block redesign work.
- **medium** — noticeable friction, workaround exists, or degrades on lower-end conditions (older devices, slower networks, larger font scales).
- **low** — best-practice gap, polish, minor inefficiency. Real, but nobody is suffering.

Do not invent intermediate levels. Do not use "critical" to signal "I really care." If you find yourself wanting to, the finding is high.

## Effort and fix risk

Every finding carries an `effort` estimate (T-shirt sized) and a `fix_risk` rating (how likely the fix itself is to destabilize something else). Together with severity and confidence, these feed the prioritization rubric in the synthesis phase.

- **effort: S** — hours, mechanical, single-file or small cluster.
- **effort: M** — a day-ish, touches multiple files, some judgment required.
- **effort: L** — multi-day, cross-cutting, or requires design input.

- **fix_risk: low** — mechanical replacement, easy to verify, no behavior change.
- **fix_risk: medium** — behavior-adjacent (touches state flow, styling system, nav shape). Needs test coverage or careful review.
- **fix_risk: high** — the fix could destabilize something that currently works. Common when the finding is a symptom of a deeper design tension.

A trivial-looking fix with `fix_risk: high` should not be treated as low-hanging fruit.

## Redesign risk

The audit exists because a visual redesign is coming. Every finding gets tagged for its interaction with that redesign:

- **none** — the redesign neither helps nor hurts this. Fix on its own schedule.
- **incidental** — the redesign will touch the same files, so this is cheap to fix alongside. Not blocking.
- **direct** — the redesign will make this worse, or the redesign cannot land cleanly without addressing this first. Blocks or gates redesign work.

The synthesis phase leans heavily on this field. Fill it honestly.

## Confidence

Subagent findings are leads until the main agent vets them. Confidence flags how firm your evidence is *at the time of writing the finding*:

- **high** — you opened the files, the excerpt is verbatim, the pattern is unambiguous.
- **medium** — you saw the pattern but could not fully trace the data flow, or the finding depends on runtime behavior you cannot verify by reading.
- **low** — you strongly suspect but the evidence is circumstantial. Include the finding only if the impact would be high or critical if confirmed; otherwise drop it.

The main agent uses this field to prioritize which findings to re-open first during Phase 3 vetting.

## What is not a finding

- Style preferences without evidence of harm ("I would have named this differently").
- Generic advice that applies to any RN codebase ("consider adding tests"). Findings must be grounded in specific files.
- Suggestions to add features. This is an audit of what exists, not a wishlist.
- Duplicates of a finding already made under a different subcategory. Cross-reference instead.
- Rediscoveries of by-design platform conventions.
- Anything you cannot cite with a real file:line.

## ID assignment

Each subagent numbers its own findings starting at `001` within its category prefix. The main agent does not renumber during synthesis — cross-references use the original IDs.

If a follow-up audit runs later against the same repo, the reconciler (out of scope for v1) keeps numbering monotonic and marks superseded findings stale in the index. For now, one-shot numbering per audit run is fine.

## Worked example

```yaml
id: PERF-014
category: performance
subcategory: List and Scroll Performance › List Item Components
title: Inventory list item creates new style object on every render
severity: high
locations:
  - path: src/screens/Inventory/InventoryItem.tsx
    lines: 42-58
    excerpt: |
      style={{
        padding: 12,
        backgroundColor: item.rarity === 'legendary' ? '#FFD700' : '#FFF',
      }}
      onPress={() => onPress(item.id)}
evidence: |
  Style object and onPress callback are both allocated inline on every render.
  The component is not wrapped in React.memo, and the parent FlatList passes
  `data` that reshuffles on every filter change, so every visible row re-renders
  on every keystroke in the search field.
impact: |
  On a 200-item inventory with the search field open, typing produces visibly
  janky updates on mid-tier Android devices. The redesign introduces rarity-based
  visual treatments that will add more conditional styles here — the jank
  compounds if the memoization pattern isn't fixed first. Template is copied
  in three other list-item components in the same directory.
redesign_risk: direct
effort: S
fix_risk: low
suggested_fix: |
  Wrap InventoryItem in React.memo with a shallow comparator on `item.id` and
  `item.rarity`. Lift the style object into a StyleSheet at module scope and
  select variants by key. Move the onPress binding into a useCallback in the
  parent, keyed on `item.id`.
confidence: high
```

That is the shape. Same schema for every category. Same fields, same values, same discipline.