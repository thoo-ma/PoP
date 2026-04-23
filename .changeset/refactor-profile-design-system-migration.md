---
"pop": patch
---

Migrate `frontend/screens/Profile*` and `frontend/styles/profile/` to the sanctioned `@/components/ui` wrappers and HeroUI semantic class names. Add `Avatar` and `Skeleton` wrappers to `frontend/components/ui/`. Sign-out button now uses the `Button` wrapper (replacing `TactileButton`); stats and balance containers now use the `Card` wrapper. Recipes in `frontend/styles/profile/modals.ts` are layout-only — colors, identity radii, and borders are applied at call sites via semantic utilities (`bg-surface-secondary`, `text-foreground`, `text-muted`, `bg-border`, `border-border`, `border-hairline`).
