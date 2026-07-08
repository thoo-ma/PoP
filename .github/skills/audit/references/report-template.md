# Report Template

Every category report follows this outer skeleton. Subcategory sections (the actual audit content) come from the category playbook and slot into section 4. Do not invent new top-level sections; do not omit ones that apply.

Reports are narrative + evidence, aimed at humans deciding what to fix and in what order. The findings YAML block sits alongside the narrative, not inside it — the narrative interprets, the findings enumerate.

## Header

```
# {Category} Audit — v2

Repo: <repo name>
Commit: <short SHA from Phase 1 recon>
Date: <ISO date>
Auditor: redesign-audit skill / {category} subagent, vetted by main agent
```

## 1. Overview

Two to four paragraphs. What this application is, what it does, and what the category-specific first impression is. This is the "fresh eyes" section — write it as if the reader has never seen this codebase.

Close the section with a one-line maturity assessment using the category's scale (defined in each playbook). Do not soften it.

## 2. What is working well

Before problems, document what is genuinely solid. Be specific — name files, modules, components, tokens, patterns. Explain why each is sound. Two to six items, prose or short list.

This section protects what works from being broken during the redesign. It is not filler and it is not flattery. If nothing is genuinely solid, say so in one line and move on; do not manufacture strengths.

## 3. Detailed audit

The category-specific sections. The playbook for this category defines the subsection headers and what each one covers. Follow the playbook's structure exactly — the synthesis phase relies on subcategory names being consistent across reports.

Under each subsection: narrative describing what you observed, evidence pointing at real files, and references to findings by ID (e.g. "see PERF-014"). The findings themselves are enumerated in section 5, not repeated here.

If a subsection genuinely does not apply to this codebase, keep the header and write one sentence explaining why. Do not silently omit.

## 4. Debt map

Findings organized by severity, in the same order as `finding-format.md` defines them.

```
### Critical
- PERF-003: <title>
- A11Y-011: <title>

### High
- PERF-014: <title>
- PERF-022: <title>
...
```

Just the ID and title, one per line. The full YAML lives in section 5.

## 5. Findings

The full YAML blocks for every finding, in ID order. This is the machine-readable part of the report — the synthesis phase reads this section, not the prose.

Each finding as a fenced YAML block. No commentary between them.

## 6. Verdict

Four subsections.

### Strengths to preserve
The specific patterns from section 2 that must be maintained through the redesign. One line each, actionable.

### Prioritization rubric

Order the "what needs to change" list by **leverage**, not raw severity. Rough rule:

```
leverage = (severity_weight × redesign_risk_weight) ÷ effort_weight
```

with tiebreakers, in order:
1. `redesign_risk: direct` beats `incidental` beats `none` (the audit's whole point).
2. Higher confidence wins — low-confidence findings sink even when severe.
3. Lower `fix_risk` wins — a "high severity, low fix_risk" fix ships before "high severity, high fix_risk".
4. Cross-cutting themes surfaced in synthesis beat isolated findings of equal score.

Do the ordering explicitly. Do not just sort by severity and call it prioritized.

### What needs to change
Prioritized list per the rubric. Each item:
- Finding ID(s)
- Why it matters, in one sentence
- Effort (S/M/L, from the finding) and fix_risk (low/med/high, from the finding)
- Blocks redesign: yes / partially / no

### Overall verdict
Pick exactly one:
- **Ready** — minor improvements only, no blocker
- **Ready with preparation** — list the specific items to address before redesign starts
- **Significant work required** — list the blockers
- **Fundamental rethinking needed** — list what and why
- **Not worth auditing further in this dimension** — valid outcome when the category is genuinely fine or the codebase is too early-stage for meaningful findings. Use this rather than padding.

One line of justification. Do not hedge across two verdicts.

## Rules for writing the report

- The narrative sections interpret; the findings section enumerates. Do not restate every finding in prose. Do not skip prose in favor of just dumping findings.
- Cite finding IDs when the narrative references specific issues. Readers use IDs to jump between sections.
- Every claim in the narrative that names a specific file or line must correspond to a finding in section 5. If it does not, either write the finding or drop the claim.
- Do not use hedge words ("possibly," "might," "seems to"). If you are hedging, the finding belongs at lower confidence, or does not belong at all.
- Do not use severity as a rhetorical device. The scale in `finding-format.md` is the only thing that determines severity.
- The overview and verdict together should read coherently on their own — a busy reader who reads only those two sections should come away with an accurate picture.