# Accessibility Playbook

You are auditing accessibility in a React Native codebase. Your subagent scope is *a11y only* — screen reader support, touch targets, visual accessibility, form accessibility, navigation accessibility, platform-specific behavior.

Structure the "Detailed audit" section of your report using the subsection headers below.

---

## Screen reader support

React Native's primary a11y mechanism is VoiceOver (iOS) and TalkBack (Android). Audit every interactive and informational element for screen-reader correctness.

**Labels.** Which interactive elements have explicit `accessibilityLabel`? Which rely on child text (acceptable)? Which have no label (failure)? Where labels are present but wrong (generic like "button", redundant, or confusing)? List every element where a screen-reader user would be lost or misled.

**Roles.** Which interactive elements declare `accessibilityRole`? Are roles semantically correct (`button` vs `link` vs `image` vs `header` vs `summary`)? Where are roles missing on elements that need them? Where are roles applied incorrectly (e.g. `button` on a text label)?

**Hints.** Where `accessibilityHint` is used and genuinely useful? Where hints are missing on non-obvious interactions (e.g. long-press for menu)? Where hints duplicate the label (redundant, should be removed)?

**States.** Disabled states communicated correctly (`accessibilityState.disabled`)? Selected/checked states on toggles, tabs, filters? Loading states? Expanded/collapsed on accordions and sheets?

**Values.** Sliders, progress bars, range inputs exposing `min`/`max`/`now`/`text` via `accessibilityValue`? Percentage or numeric values communicated correctly?

**Flow.** Would a screen-reader user encounter elements in a logical order? Focus traps (modal opens but focus stays behind)? Focus leaks (modal dismisses and focus lost entirely)? Elements grouped that should be grouped, fragmented where they should not be?

---

## Touch targets

**Minimum sizes.** iOS HIG minimum 44×44pt, Android 48×48dp. For every interactive element: what is the actual rendered touch target? List every element below minimum with its actual size. Any elements that look tappable but have no handler? Any elements with handlers but no visual affordance?

**Spacing.** Interactive elements spaced far enough apart to prevent accidental activation? Any dangerously close?

**Hit slop.** Where `hitSlop` is used to expand touch targets. Places where it should be but is not. Places where values are inconsistent (this button has hitSlop 8, that identical one has 12).

---

## Visual accessibility

**Contrast.** Audit foreground/background combinations: text on backgrounds, interactive labels on their backgrounds, status indicators (error, warning, success, info), disabled state contrast. For each combination: is it likely to meet WCAG AA (4.5:1 normal, 3:1 large)? Exact ratios require rendering — flag combinations that appear risky based on the token values in use. Coordinate with design-system subagent on token-level fixes.

**Color as only differentiator.** Where color is the only way to communicate information (error states, status badges, availability indicators, rarity/tier). Icons, patterns, labels, or shapes accompanying color? What would a colorblind user miss?

**Text sizing.** Text sized in a way that respects system font scaling (`allowFontScaling` on `Text`, avoiding fixed sizes)? Fixed pixel sizes that would not scale? Layout behavior at large font scales — clipping, overlap, unreadable truncation?

**Motion.** What animations exist? Any potentially problematic for vestibular disorders (large parallax, aggressive spring bounces)? Reduced-motion mechanism in place (`AccessibilityInfo.isReduceMotionEnabled()`)? Animations conveying information (not just decoration) — is that information available another way when motion is off?

---

## Interactive components

For each distinct interactive component type (buttons, inputs, sliders, tabs, modals, sheets, selects, cards with actions):

- Component name and location
- A11y attributes present
- A11y attributes missing
- Screen-reader announcement quality (order, redundancy, completeness)
- Any interaction pattern that would confuse assistive tech
- Verdict per component type: accessible / partially accessible / inaccessible

Do not audit every instance — audit each *type*. If Button is inaccessible, the finding covers every use of Button.

---

## Forms and inputs

**Labeling.** Inputs associated with visible labels? Inputs identified to screen readers when labels are not visible? Placeholder-only inputs (major failure — placeholder disappears on focus)?

**Errors.** Validation errors communicated to screen readers? Errors associated with the specific input that caused them? Errors announced automatically (`accessibilityLiveRegion` / `AccessibilityInfo.announceForAccessibility`) or only discoverable on focus?

**Input types.** Inputs declaring correct `keyboardType` (numeric, email, decimal-pad)? `textContentType` / `autoComplete` set for autofill? `returnKeyType` defined and logical (next → done)? `onSubmitEditing` chaining set up for multi-field forms?

**Submission.** Submission state (loading, success, error) communicated to screen readers? Errors announced or only visually shown?

---

## Navigation accessibility

**Tab bar.** Tab items correctly labeled and roled? Active tab communicated (`accessibilityState.selected`)? Tab icons supplemented with labels for screen-reader users?

**Screen transitions.** Focus managed when screens change? Focus lands in a logical place after navigation? Screen titles announced?

**Modals and sheets.** When opened, does focus move into the modal? Content behind the modal hidden from screen readers (`accessibilityViewIsModal` on iOS, `importantForAccessibility="no-hide-descendants"` on Android)? On dismiss, does focus return to the triggering element?

**Gestures.** Swipe / custom gestures accessible via alternative means? Custom gestures exposed as `accessibilityActions` to assistive tech?

---

## Content

**Images and media.** Decorative images hidden from screen readers (`accessibilityElementsHidden`, `importantForAccessibility="no"`)? Informational images described with `accessibilityLabel`? Any images carrying meaning that is not conveyed elsewhere?

**Dynamic content.** When content updates dynamically, screen readers informed (`accessibilityLiveRegion` on Android, `AccessibilityInfo.announceForAccessibility` on iOS)? Loading states announced, not only visual? Toasts accessible to screen-reader users? Countdowns and timers accessible?

**Text content.** Headings marked up to create a logical document structure (`accessibilityRole="header"`)? Decorative text hidden where appropriate? Truncated text accessible in full to screen readers?

---

## Platform-specific

**iOS / VoiceOver.** iOS-specific APIs used where they help? Any behaviors that work on Android but fail on iOS? Custom `accessibilityActions` defined where VoiceOver would benefit?

**Android / TalkBack.** Android-specific patterns missing? `importantForAccessibility` usage — correct, missing, or misused? Live-region behavior tested?

**Cross-platform consistency.** A11y behaviors differing between platforms unintentionally? Where platform differences are intentional, are they documented in code?

---

## Maturity scale

Report your section 1 assessment as exactly one of:

- **none** — no `accessibilityLabel`, no `accessibilityRole`, touch targets ignored, contrast unchecked. Screen-reader users cannot navigate.
- **minimal** — labels on primary CTAs, nothing else. Occasional roles. Everything else broken for AT users.
- **partial** — most interactive elements labeled, some roles, touch targets mostly compliant. Systemic gaps (dynamic content silent, modals mismanaged).
- **consistent** — labels, roles, states across the app. Modals and screens manage focus. Reduced motion respected.
- **production-grade** — a11y patterns encoded in the component library, tested with real AT, per-platform behavior deliberate.

Do not soften. If dynamic content is silent to screen readers, that alone caps you at partial regardless of static coverage.

---

## Category-specific "not a finding"

- Every RN app is missing something. Focus on findings that materially block a user with a disability, not exhaustive coverage of every possible `accessibilityHint` you could add.
- Contrast findings on backgrounds that only appear briefly (transient loading states) unless the transient content is itself important.
- Missing `accessibilityLabel` on text that reads correctly as-is via child text content — that is expected behavior, not a finding.
- Suggestions to "add a11y testing library X" — a valid recommendation for the roadmap, but not an audit finding against code that exists.
- A11y gaps in third-party components you do not own — flag once as a systemic issue, do not enumerate every instance.