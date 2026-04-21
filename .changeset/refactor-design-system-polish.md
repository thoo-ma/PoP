---
"pop": patch
---

Design-system polish (pre-redesign foundation, #432). Establish the
single source of design tokens and conventions in `frontend/global.css`,
sweep typography/opacity/text-outline usage, rename tv() recipes to the
`*Frame` / `*Panel` / `*Modal` / `*Slot` taxonomy, and migrate every
border-radius class to the new semantic tokens (`rounded-tag`,
`rounded-body`, `rounded-frame`, `rounded-card`, `rounded-modal`).
Renames the `AlertBox` component to `AlertFrame` for parity with its
recipe. Audits per-site fractional spacing (annotated where intentional,
normalized where accidental) and adds `TODO(redesign)` markers at three
sites where shared abstractions were considered and deferred. No visual
shift expected — the new radius tokens map 1:1 onto the previous Tailwind
defaults.
