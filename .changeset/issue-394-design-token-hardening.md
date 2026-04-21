---
"pop": patch
---

Design token & style hardening (#394): add `--border-tactile-sm/md/lg` (3/5/6px) scale and migrate every tactile call-site, eliminating the 4px outlier on `tactileNavButton`. Darken `--color-on-surface-variant` from `#b0a39d` (~2.2:1) to `#6b5d54` (~5.1:1) to meet WCAG AA. Extract `AlertBox` inline styles to a `tv()` recipe in `styles/shared/alertBox.ts`. Document the blessed spacing scale, tactile border convention, and muted-text font-weight pairing at the top of `global.css`.
