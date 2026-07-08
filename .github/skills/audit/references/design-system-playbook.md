# Design System Playbook

You are auditing whether this codebase's design system is ready for a visual redesign. Your subagent scope is *design system only* — token layer, component consistency, screen-level consistency. Rendering performance and accessibility live in other subagents' reports; do not double-count.

Depth over breadth. The broad architecture is likely sound. Your job is to find the subtle inconsistencies, edge cases, and gaps that only become visible when the major issues are gone — the kind of things that make an app feel "off" without users being able to say why.

Structure the "Detailed audit" section of your report using the subsection headers below.

---

## Token layer

**Colors.** Are semantic names used consistently (`text.primary`, `surface.raised`) or are components reaching for palette values directly (`gray.700`)? Any component using a token for a purpose that does not match its semantic name? Are light and dark variants complete and balanced? Orphaned tokens (defined but never used)? Missing tokens (values used but not tokenized)?

**Typography.** Is the type scale internally consistent (clear progression, no near-duplicate sizes)? Are semantic roles (display, heading, body, caption) applied correctly everywhere, or are there screens using the wrong role for their content? Line heights and letter spacing defined and consistent? Behavior at 2× system font scale?

**Spacing.** Is the scale followed precisely, or are there near-misses (12 where 16 would match)? Used semantically (padding vs margin vs gap for their correct purpose)? Any arbitrary bracket values or magic numbers remaining?

**Radius.** Applied consistently to correct element types? Any element using a radius that does not match its visual category (a card with button radius, a chip with card radius)?

**Elevation and depth.** How is depth communicated (shadow, border, background contrast, blur)? Is the depth system consistent or ad-hoc? Any layers that overlap ambiguously (two "raised" surfaces at the same z)?

**Motion.** Are durations and easing curves tokenized? A motion scale, or each animation ad-hoc? Does the app respect `prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled()`?

---

## Component consistency

**Cross-component consistency.** Similar components using similar patterns (all cards same padding scale, all buttons same height scale)? Variant names meaning the same thing across components (does `primary` on Button mean what `primary` on Alert means)? State representations consistent (does disabled look and feel like the same concept everywhere)?

**Contract completeness.** For each component: are all states handled (default, pressed, focused, disabled, loading, error, empty)? Are all variants documented or self-evident? Are there states that exist in some components but not others where they should (e.g. Button has loading, IconButton does not)?

**Slots and composition.** Compound component slots used consistently (e.g. `Card.Header` / `Card.Body` / `Card.Footer` — where they exist, are they used everywhere or bypassed)? Components that should have slots but do not? Components with slots used inconsistently across screens?

---

## Screen-level consistency

**Layout.** Do screens of the same type (list, form, detail, empty) share the same layout patterns? Screen margins, header spacing, content areas consistent? Loading/error/empty visually consistent across screens?

**Information hierarchy.** Visual hierarchy consistent across screens (what draws the eye first, second, third)? Heading levels used consistently? Secondary/muted content treated the same way everywhere?

**Interaction patterns.** Similar interactions look and behave the same across screens? Confirmation patterns consistent (dialog vs inline)? Feedback patterns consistent (toast vs inline vs alert)?

---

## Subtle inconsistencies

The fine-grained findings. Things that are almost right but subtly different. Two `12px` paddings that should both be `16`. Three components using `radius.md` and one using `10`. Two loading spinners at different sizes. Modal close buttons at the top-right in nine screens and top-left in the tenth.

For each: what the inconsistency is, exact files and values, what it should be to match the system, why it matters for perceived quality.

These are the highest-signal findings for a pre-redesign audit. Look hard.

---

## Design system gaps

Things that should be defined for a complete design system but are not — or are partially defined. For each: what is missing, what problem the absence causes during the redesign, suggested direction to fill it.

Common gaps to check for specifically:
- No motion tokens (durations, easings)
- No elevation scale (each shadow ad-hoc)
- No opacity scale for disabled/muted states
- No z-index scale (modal, sheet, toast, tooltip overlapping ambiguously)
- Icon sizing not tokenized
- No `Text` primitive that consolidates typography role application

---

## Maturity scale

Report your section 1 assessment as exactly one of:

- **no system** — inline styles, hex values, hard-coded sizes. Every screen is bespoke.
- **ad-hoc** — some tokens exist, most components ignore them. Consistency is accidental.
- **emerging** — token layer defined, applied in newer components. Older code drifts.
- **consistent** — tokens and component patterns applied throughout. Occasional lapses.
- **production-grade** — tokens are the only way to style, component contracts complete, cross-component variants aligned. A redesign is a token swap plus a component-file audit.

Do not soften. If tokens exist but half the codebase bypasses them, that is ad-hoc, not emerging.

---

## Category-specific "not a finding"

- Personal aesthetic disagreements ("this palette feels dated"). The audit is about system consistency, not design taste. The redesign will address taste.
- One-off inline styles in obviously experimental or dead code. Focus on production code paths.
- Missing tokens for values that only appear once. Tokenize values used in ≥ 2 places; single-use values are literals.
- "Should switch styling library from X to Y" is not a finding unless X is actively breaking during a redesign (e.g. runtime style computation making perf gains impossible). If flagged, cross-file to performance-playbook territory and coordinate with the perf subagent's finding.