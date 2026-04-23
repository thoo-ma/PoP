---
"pop": patch
---

Migrate `nft/` feature surface to `@/components/ui` wrappers and HeroUI semantic class names (#460). Add six new pass-through wrappers (`Dialog`, `Skeleton`, `Tabs`, `SearchField`, `Slider`, `Chip`); route all `nft/` component and screen imports through `@/components/ui` (except the `cn` utility, the `useToast` hook, and a single `Spinner` use). Swap MD3 vocabulary (`text-on-surface`, `bg-surface-container-low`, `border-outline`, `bg-app-success-container`, `bg-app-amber`, `bg-surface-overlay-dim`, …) for HeroUI semantic tokens (`text-foreground`, `bg-surface-secondary`, `border-border`, `bg-success-soft`, `bg-amber`, `bg-black/40`, …) inside `styles/nft/*.ts` recipes and at remaining JSX call sites in `components/nft/*` and `screens/nft/*`. Domain-color recipes (`rarityBadge`, `typeBadge`) and stat color CSS variables retained.
