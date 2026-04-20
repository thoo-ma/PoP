## Plan: Design System Foundation — Full Audit Remediation

Address every issue from the design audit: define semantic token scales (typography, spacing, radius, borders) in global.css, unify divergent component patterns, extract shared sub-components, add missing screen states, and eliminate inline style escapes. The codebase is already ~90% design-system-ready — this plan closes the remaining ~10%.

---

### Phase 1 — Token System Definition
*No component files touched — only global.css and `styles/**/*.ts`.*

**Step 1.1: Typography tokens** — Define 11 semantic font-size CSS variables in global.css (`--font-size-display-xl` through `--font-size-caption-sm`) with corresponding Tailwind utilities (`text-display-xl`, etc.). Search-and-replace all 20 `text-[Npx]` bracket values across every style `.ts` file.

**Step 1.2: Spacing tokens** — Define named spacing variables for magic-number screen offsets (`--spacing-screen-top-sm: 60px`, `--spacing-tab-clearance-lg: 170px`, `--spacing-icon-gap: 12px`, etc.). Replace all `pt-[60px]`, `pb-[120px]`, etc. in layout.ts, buttons.ts, screens.ts.

**Step 1.3: Border radius tokens** — Define 5 radius tokens (`--radius-sm` through `--radius-full`). Eliminate `rounded-[14px]`, `rounded-[10px]`, `rounded-[24px]` across breed.ts, cards.ts, phases.ts, navigation.ts.

**Step 1.4: Border width normalization** — Standardize the tactile 3D system to exactly 3 tiers: primary (`3px/6px`), secondary (`3px` uniform or `2px/4px`), tertiary (`2px/3px`). Normalize the 6+ current combinations.

**Verification:** `pnpm typecheck` passes. Visual regression: every screen pixel-identical (semantic tokens map to same values). Grep for remaining `text-[`, `rounded-[`, `pt-[`, `pb-[` in `styles/` — near zero.

---

### Phase 2 — Shared Sub-Component Extraction

**Step 2.1: ProgressBar component** *(parallel with 2.2)* — New `frontend/components/shared/ProgressBar.tsx` + `frontend/styles/shared/progress-bar.ts`. Replaces the duplicated track+fill pattern in NFTProperties.tsx, BreedOutcomePanel.tsx, and the XP bar in NFTCard.tsx.

**Step 2.2: BadgeOverlay component** *(parallel with 2.1)* — New `frontend/components/shared/BadgeOverlay.tsx`. Merges `badgePosition` (Chip-based, 5 positions) and `overlayBadge` (View-based, 3 positions) from badges.ts into one unified badge system. Replaces usage in NFTCard.tsx, NFTDetailCard.tsx, MysteryBoxCard.tsx.

**Step 2.3: NFTDetailCard → HeroUI Card** *(depends on 2.2)* — Refactor NFTDetailCard.tsx to use HeroUI `Card` compound API (Card.Header/Body) for consistency with NFTCard. Reuse BadgeOverlay. Stays as a separate component (per decision).

**Verification:** `pnpm typecheck` passes. All card/badge/bar visuals identical to before.

---

### Phase 3 — Component Pattern Unification

**Step 3.1: Card border unification** *(parallel with 3.2, 3.3)* — Adopt the wrapper-View pattern (`cardWrapper`+`cardContainer`) as canonical for all bordered cards. Apply to BreedPickerItemCard, BreedOutcomePanel, LootRouletteCard — all currently use direct border on Card root.

**Step 3.2: Tabs styling unification** *(parallel with 3.1, 3.3)* — Create a `tactileTabs` tv() recipe in navigation.ts. Apply to both Vault.tsx (currently has custom tactile styling) and Marketplace.tsx (currently bare defaults) so they match.

**Step 3.3: Select trigger unification** *(parallel with 3.1, 3.2)* — Create one `tactileSelect` tv() recipe. Replace both FilterControls' `selectTrigger` slot (heavy 3px/6px borders) and SortToolbar's inline className (light 2px/3px borders) with a single consistent pattern.

**Step 3.4: SortControls/FilterControls dedup** *(depends on 3.3)* — Delete SortControls.tsx (pure pass-through). Update FilterControls.tsx to compose `SortToolbar` internally. Update Marketplace.tsx to import `SortToolbar` directly.

**Step 3.5: ScreenHeader → tv() recipe** — Move the hardcoded inline className from ScreenHeader.tsx to a `screenHeader` recipe in navigation.ts.

**Step 3.6: Vault action buttons → TactileButton** — Replace raw `Button` + `cn(tactileButton())` in Vault.tsx card action slots and scroll-to-top with `TactileButton`, matching all other screens.

**Verification:** `pnpm typecheck` passes. Vault and Marketplace tabs look identical. No import errors from SortControls removal.

---

### Phase 4 — Inline Style Cleanup & Missing States

**Step 4.1: Inline style → className** *(parallel with 4.2, 4.3)* — Replace `style={{ marginRight: 12 }}` on all icons (6 occurrences in Auth, OAuthButton, InviteCodeScreen) with `className="mr-3"`. Replace `contentContainerStyle` in BreedPickerModal.tsx with `contentContainerClassName`. Leave legitimate runtime `style={{}}` (width%, backgroundColor from hooks, Animated transforms).

**Step 4.2: Missing empty states** *(parallel with 4.1, 4.3)* — Vault NFTs tab: `AlertBox` when filtered to zero results. Marketplace Buy tab: `AlertBox` when no listings. Uses existing patterns.

**Step 4.3: Missing error states** *(parallel with 4.1, 4.2)* — Marketplace: `ScreenError` guard for both tabs' data loading failures. Profile: inline `AlertBox status="danger"` for `useProfileStats`/`useWallet` failures.

**Step 4.4: Mystery Boxes tab skeleton** — Add content-shaped skeletons for mystery box loading state in Vault. New `mysteryBoxSkeleton` recipe in skeletons.ts.

**Verification:** `pnpm typecheck` passes. Grep `style={{` → only legitimate runtime values. Manually verify empty/error states.

---

### Phase 5 — Final Validation

**Step 5.1: Full grep audit** — Confirm zero remaining arbitrary bracket values in style files (except computed values), zero inline margin/padding styles on components.

**Step 5.2: Changeset** — Per project conventions.

**Step 5.3: Typecheck** — `pnpm typecheck` clean.

---

### Relevant Files Summary

| Category | Files |
|---|---|
| **Token definitions** | global.css |
| **New components** | `frontend/components/shared/ProgressBar.tsx`, `frontend/components/shared/BadgeOverlay.tsx` |
| **New style files** | `frontend/styles/shared/progress-bar.ts` |
| **Deleted** | SortControls.tsx |
| **Style files modified** | All 15 files under styles |
| **Components modified** | 13 component files (NFTCard, NFTDetailCard, MysteryBoxCard, NFTProperties, LootRouletteCard, BreedOutcomePanel, BreedPickerItemCard, BreedPickerModal, FilterControls, SortToolbar, ScreenHeader, Auth, OAuthButton) |
| **Screens modified** | Vault, Marketplace, ProfileScreen, InviteCodeScreen |

### Excluded from Scope
- Dark theme definition (designer scope — token structure supports it)
- Animation system (Reanimated loot wheel — separate effort)
- Marketplace buy flow (stub)
- Icon library consolidation (4 packages — designer decision)
- DevCatalog / DevPreviewRenderer (dev-only)