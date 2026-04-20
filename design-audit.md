I now have comprehensive data on every component, style file, screen, and pattern. Let me compile the audit document.

Here's the complete design audit based on my thorough analysis of the entire frontend codebase:

---

# Design Audit — PoP Frontend

> **Generated**: 2026-04-19
> **Scope**: frontend — React Native + Expo, HeroUI Native, Uniwind (Tailwind v4), tailwind-variants

---

## 1. COMPONENT INVENTORY

### 1.1 HeroUI Native Components in Use

Every HeroUI Native import across all files:

| Component | Compound API Used | Where |
|---|---|---|
| **Button** | `Button.Label` | TactileButton, Auth, OAuthButton, IdlePhase, Vault, Breed, Repair, NFTSelector, InviteCodeScreen, ProfileScreen |
| **Card** | `Card.Header`, `Card.Body`, `Card.Title` | NFTCard, MysteryBoxCard, LootRouletteCard, BreedOutcomePanel, BreedPickerItemCard |
| **Chip** | `Chip.Label` | NFTCard (badges), MysteryBoxCard, BreedParentSlot |
| **Dialog** | `Dialog.Portal`, `.Overlay`, `.Content`, `.Title`, `.Description`, `.Close` | MysteryBoxRevealModal, StatAllocationModal, Poop, Marketplace, useSignOutDialog |
| **BottomSheet** | `BottomSheet.Portal`, `.Overlay`, `.Content` | BreedPickerModal |
| **Slider** | `Slider.Track`, `.Fill`, `.Thumb` | DegenBar, StatAllocationModal, Repair |
| **Select** | `Select.Trigger`, `.Value`, `.TriggerIndicator`, `.Portal`, `.Overlay`, `.Content`, `.Item` | FilterControls, SortToolbar |
| **Alert** | `Alert.Indicator`, `.Content`, `.Title`, `.Description` | AlertBox |
| **Tabs** | `Tabs.List`, `.Indicator`, `.Trigger`, `.Label`, `.Content` | Vault, Marketplace |
| **TagGroup** | `TagGroup.List`, `.Item`, `.ItemLabel` | FilterControls |
| **SearchField** | `SearchField.Group`, `.SearchIcon`, `.Input`, `.ClearButton` | Vault, Marketplace |
| **Avatar** | `Avatar.Image`, `.Fallback` | ChallengeHeader, ProfileScreen |
| **InputOTP** | `InputOTP.Group`, `.Slot`, `.Separator` | InviteCodeScreen |
| **Skeleton** | (flat) | Vault, Marketplace, Breed, Repair, ProfileScreen |
| **Spinner** | (flat) | ScreenLoader, Auth, OAuthButton, LootRouletteCard |
| **Separator** | (flat) | DegenBar |
| **PressableFeedback** | (flat) | BreedParentSlot, BreedPickerItemCard |
| **LinkButton** | `LinkButton.Label` | Auth, InviteCodeScreen |
| **FieldError** | (flat) | InviteCodeScreen |
| **Accordion** | `AccordionLayoutTransition` | DevCatalog (dev-only) |
| **HeroUINativeProvider** | — | App.tsx (root) |
| **cn** | (utility) | Widespread (20+ files) |
| **useToast** | (hook) | Auth, Vault, Marketplace, Breed, Repair, LootRouletteCard |

### 1.2 Custom Components (28 total)

| Component | File | Role | Wraps HeroUI? |
|---|---|---|---|
| **TactileButton** | TactileButton.tsx | 3D tactile-styled button with variant/size | Yes (Button) |
| **AlertBox** | AlertBox.tsx | Tactile-bordered alert with flexible description | Yes (Alert) |
| **NFTCard** | NFTCard.tsx | Grid card with image, badges, properties, XP bar, action slot | Yes (Card + Chip) |
| **NFTDetailCard** | NFTDetailCard.tsx | Larger detail card for Poop/Repair | No (raw Views) |
| **MysteryBoxCard** | MysteryBoxCard.tsx | Grid card for mystery boxes | Yes (Card + Chip) |
| **MysteryBoxRevealModal** | MysteryBoxRevealModal.tsx | Celebration dialog after box opening | Yes (Dialog) |
| **StatAllocationModal** | StatAllocationModal.tsx | Bottom-sheet dialog with stat sliders | Yes (Dialog + Slider) |
| **LootRouletteCard** | LootRouletteCard.tsx | Hold/roll loot card | Yes (Card) |
| **NFTProperties** | NFTProperties.tsx | Stat bar display (compact/detailed modes) | No |
| **NFTSelector** | NFTSelector.tsx | Prev/next arrow pagination | Yes (Button) |
| **BreedOutcomePanel** | BreedOutcomePanel.tsx | Probability breakdown card | Yes (Card) |
| **BreedParentSlot** | BreedParentSlot.tsx | Tappable parent slot (filled/empty) | Yes (PressableFeedback + Chip) |
| **BreedPickerItemCard** | BreedPickerItemCard.tsx | Grid card for breed picker | Yes (Card + PressableFeedback) |
| **BreedPickerModal** | BreedPickerModal.tsx | BottomSheet with 2-column NFT grid | Yes (BottomSheet) |
| **FilterControls** | FilterControls.tsx | Sort + filter toolbar | Yes (Select + TagGroup) |
| **SortControls** | SortControls.tsx | Sort-only toolbar (pass-through) | — |
| **SortToolbar** | SortToolbar.tsx | Shared sort dropdown + direction toggle | Yes (Select) |
| **DegenBar** | DegenBar.tsx | Risk slider with safe/degen zones | Yes (Slider + Separator) |
| **PageIndicator** | PageIndicator.tsx | Custom bottom tab bar | No (raw Animated + Pressable) |
| **ScreenHeader** | ScreenHeader.tsx | Floating screen title | No |
| **ErrorBoundary** | ErrorBoundary.tsx | Class component error boundary | No |
| **ScreenError** | ScreenError.tsx | Full-screen error state | Custom (AlertBox + TactileButton) |
| **ScreenLoader** | ScreenLoader.tsx | Full-screen loading spinner | Yes (Spinner) |
| **ScreenInfo** | ScreenInfo.tsx | Full-screen informational message | Custom (AlertBox) |
| **ChallengeHeader** | ChallengeHeader.tsx | NFT info row for game phases | Yes (Avatar) |
| **IdlePhase** | IdlePhase.tsx | Idle state with NFT picker/selector | Composite |
| **CountdownPhase, ImmobilityPhase, PromptPhase, RecordingPhase, ResultsPhase, RoulettePhase** | proof/ | Game phase components | Composite |
| **Auth** | Auth.tsx | Auth screen with OAuth | Composite |
| **OAuthButton** | OAuthButton.tsx | Provider-specific sign-in button | Custom (TactileButton) |

### 1.3 Non-HeroUI Components That Need a Migration Decision

| Component | Current Implementation | Decision Needed |
|---|---|---|
| **PageIndicator** | Raw `Pressable` + `Animated.View` + `MaterialCommunityIcons` | Replace with HeroUI NavBar or keep custom for tab bar animation? |
| **ScreenHeader** | Raw `View` + `Text` with hardcoded inline className | Wrap in tv() recipe minimum; consider HeroUI TopBar if one ships |
| **NFTDetailCard** | Raw `View` + `Image` + `Text`, no HeroUI Card | Migrate to Card compound component for consistency with NFTCard |
| **NFTProperties / PropertyBar** | Raw `View` + `Text` with inline `style={{backgroundColor}}` | Consider HeroUI Progress component if bar semantics match |
| **XP bar in NFTCard** | Manual `View` track + fill pattern | Same as above |
| **Icon spacing** | `style={{ marginRight: 12 }}` inline on all icon instances | Migrate to className `mr-3` |

### 1.4 Icon Libraries in Use

| Library | Icons | Where |
|---|---|---|
| `@expo/vector-icons/FontAwesome6` | `flask`, `code`, `x-twitter` | Auth |
| `@expo/vector-icons/AntDesign` | `google`, `apple` | OAuthButton |
| `@expo/vector-icons/Feather` | `chevron-left`, `chevron-right`, `log-out` | NFTSelector, InviteCodeScreen |
| `@expo/vector-icons/MaterialIcons` | `logout`, `person` | ProfileScreen |
| `@expo/vector-icons/MaterialCommunityIcons` | `emoticon-poop`, `treasure-chest`, `flask-round-bottom`, `hammer-screwdriver`, `emoticon-happy` | PageIndicator |

---

## 2. TOKEN USAGE AUDIT

### 2.1 Colors

**Verdict: CONSISTENT** — All colors are defined as CSS variables in global.css. Zero hardcoded hex/rgb/named color values found in any `.tsx` or style `.ts` file.

| Token Category | Variables | Count |
|---|---|---|
| **Surface/Background** | `--color-background`, `--color-surface`, `--color-surface-container-low`, `--color-surface-container-highest`, `--color-surface-overlay`, `--color-surface-overlay-rail`, `--color-surface-overlay-dim` | 7 |
| **Text/Foreground** | `--color-on-surface`, `--color-on-surface-variant`, `--color-on-primary` | 3 |
| **Primary** | `--color-primary`, `--color-primary-container`, `--color-primary-dark`, `--color-primary-darker` | 4 |
| **Border** | `--color-outline` | 1 |
| **NFT Stats** | `--color-stat-efficiency`, `--color-stat-resilience`, `--color-stat-comfort`, `--color-stat-luck`, `--color-stat-energy`, `--color-stat-level` | 6 |
| **NFT Type** | `--color-type-cruise-seat`, `--color-type-turbo-flush`, `--color-type-zen-fortress` | 3 |
| **NFT Rarity** | `--color-rarity-common`, `--color-rarity-rare`, `--color-rarity-legendary`, `--color-rarity-transcendent` | 4 |
| **Status/Feedback** | `--color-app-success`, `--color-app-error`, `--color-app-warning`, `--color-app-info`, `--color-app-mystery`, `--color-app-amber` + 3 container variants | 9 |
| **Overlays** | `--color-overlay-dark`, `--color-overlay-dark-mid`, `--color-overlay-dark-heavy` | 3 |
| **Badge** | `--color-badge-level` | 1 |
| **HeroUI Bridge** | `--surface`, `--foreground`, `--muted`, `--border`, `--accent`, etc. | 10 |

Dynamic color access method: `useCSSVariable()` hook and `useRarityColors()` custom hook. Runtime `style={{backgroundColor}}` only used where values come from these hooks (e.g., rarity colors on Chip/View backgrounds).

### 2.2 Spacing

**Verdict: INCONSISTENT** — Mix of Tailwind scale values and arbitrary bracket values with no clear mapping.

**Tailwind scale values used** (consistent, from spacing scale):
`gap-1` through `gap-6`, `p-2` through `p-5`, `px-1` through `px-12`, `py-0.5` through `py-8`, `mb-0.5` through `mb-10`, `mt-1` through `mt-8`

**Arbitrary bracket values** (inconsistent — magic numbers):
| Category | Values Found | Issue |
|---|---|---|
| **Heights** | `h-[60px]`, `h-[64px]`, `h-[40px]`, `h-[48px]`, `h-[280px]`, `h-[360px]` | No clear scale; 60 vs 64 is suspicious |
| **Widths** | `w-[48px]`, `w-[36px]`, `w-[50px]`, `w-[90px]`, `w-70`, `w-[240px]`, `w-[52px]` | Each is a one-off |
| **Top padding** | `pt-[60px]`, `pt-[100px]` | Two magic screen-top offsets |
| **Bottom padding** | `pb-[120px]`, `pb-[140px]`, `pb-[170px]` | Three different bottom-tab clearances |
| **Inline style** | `marginRight: 12` (5×), `marginBottom: 2`, `padding: 16`, `paddingBottom: 40` | Should be className |

### 2.3 Font Sizes

**Verdict: INCONSISTENT** — 13 arbitrary bracket sizes plus 7 Tailwind scale sizes = 20 distinct font sizes.

| Arbitrary `text-[Npx]` | Where Used | Potential Token |
|---|---|---|
| `text-[80px]` | Timer countdown | `display-xl` |
| `text-[48px]` | Auth headline | `display-lg` |
| `text-[36px]` | Empty slot plus icon | `display-md` |
| `text-[32px]` | Screen titles, repair value | `heading-lg` |
| `text-[26px]` | Breed result title, separator, code input | `heading-md` |
| `text-[22px]` | Arrow text | `heading-sm` |
| `text-[20px]` | Scroll-to-top arrow | — |
| `text-[17px]` | NFT selector counter | — |
| `text-[15px]` | Button label, challenge header name | `body-lg` |
| `text-[14px]` | Tagline | `body-md` |
| `text-[13px]` | Various labels, error messages, prompt subtitle | `body-sm` |
| `text-[11px]` | Footer links, badge labels, rarity text | `caption` |
| `text-[10px]` | Compact property bar label/value | `caption-sm` |

Tailwind scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl` — used alongside bracket values without clear mapping.

### 2.4 Font Weights

**Verdict: CONSISTENT** — Only 3 weights in active use.

| Weight | Usage Pattern |
|---|---|
| `font-black` (900) | Primary headings, screen titles, button labels, active tab labels, countdown timer |
| `font-bold` (700) | Body text, secondary labels, descriptions, inactive tabs, stat values |
| `font-extrabold` (800) | Points value in stat modal (1 occurrence) |

### 2.5 Border Radius

**Verdict: PARTIALLY CONSISTENT** — A "tactile" design language is evident but with too many one-off values.

| Value | Semantic Role | Frequency |
|---|---|---|
| `rounded-full` | Pills, badges, buttons, tab rail | High |
| `rounded-2xl` (16px) | Cards, modals, info boxes, buttons | High |
| `rounded-3xl` (24px) | Dialog content | Medium |
| `rounded-xl` (12px) | Result panels, breed picker card, picker button | Medium |
| `rounded-lg` (8px) | Overlay badges, parent images | Low |
| `rounded-md` (6px) | Skeleton lines | Low |
| `rounded-[14px]` | Parent slot, challenge header | 2× — should be `rounded-2xl` or dedicated token |
| `rounded-[13px]` | Card container inner (16 − 3 border) | 1× — computed, acceptable |
| `rounded-[10px]` | Challenge header avatar | 1× — should be `rounded-lg` or `rounded-xl` |
| `rounded-[24px]` | Page indicator rail | 1× — same as `rounded-3xl` |

### 2.6 Border Widths (the "3D tactile" system)

**Verdict: MOSTLY CONSISTENT** — Clear intent for a tactile 3D card/button language, but slight variations.

| Combination | Role | Where |
|---|---|---|
| `border-[3px] border-b-[6px]` | Primary tactile buttons, tabs, select triggers | TactileButton, FilterControls select, Vault Tabs.List |
| `border-[3px] border-b-[5px]` | Tactile cards, alerts | cardWrapper, lootCard, AlertBox |
| `border-2 border-b-[4px]` | Nav arrows | tactileNavButton |
| `border-[3px]` (uniform) | Info containers, modals, stats row, parent slots | infoBox, challengeHeader, profileModal, outcomePanel, signOutDialog |
| `border-[2px] border-b-[3px]` | Secondary elements | SortToolbar select trigger, tag items |
| `border-2` | Tertiary | Vault Tabs.Indicator, empty parent slot |
| `border-[1.5px]` | Small detail | Rarity dot in breed picker |
| `border` (1px) | Minimal | Breed parent image, outline button |

---

## 3. PATTERN INVENTORY

### 3.1 Screen Layouts

| Pattern | Screens | Structure |
|---|---|---|
| **Tabbed Grid** | Vault, Marketplace | `screenContainer` → `Tabs` → `SearchField` → Sort/Filter → `ScrollView` → 2-col grid of Cards |
| **Action Form** | Breed, Repair | `screenContainer` → `ScrollView` → NFT selector → Info/config panels → DegenBar → Action button |
| **State Machine** | Poop | `screenContainer` → `ScrollView` → Phase-based rendering (idle → countdown → immobility → prompt → recording → results → roulette) |
| **Profile/Dashboard** | ProfileScreen | `screenContainer` → `ScrollView` → Avatar → Info → Stats row → Wallet card → Actions |
| **Auth** | Auth, InviteCodeScreen | Full-screen centered: Logo → Headline → Tagline → Input → Buttons → Footer links |

### 3.2 Recurring Component Combinations

1. **Card + Badge Overlay** — `Card.Header` → `Image` (full-width) → absolutely positioned `Chip` badges (level, type, rarity, status). Used in: NFTCard, MysteryBoxCard.

2. **Card + Action Slot** — Card renders content then passes `action?: ReactNode` to its footer area. Used in: NFTCard, MysteryBoxCard.

3. **NFT Picker → Selector → Detail Card** — Empty dashed `nftPickerButton` → `NFTSelector` arrows → `NFTDetailCard`. Used in: IdlePhase (Poop), Repair.

4. **AlertBox + TactileButton** — AlertBox with status → one or two TactileButtons below. Used in: ScreenError, all game phases (Prompt, Recording, Results), Breed bust, Repair success.

5. **Stat Bar Row** — Label → Track (background) → Fill (colored, width%) → Value text. Used in: NFTProperties (PropertyBar), BreedOutcomePanel, XP bar in NFTCard.

6. **Dialog Pattern** — `Dialog` → `Dialog.Portal` → `Dialog.Overlay` → `Dialog.Content` → Title + Description → Button row. Used in: MysteryBoxRevealModal, StatAllocationModal, sign-out dialog, Marketplace info, Poop alerts.

7. **Cost + DegenBar** — Info box with Slider → DegenBar (risk slider) → Action button with strikethrough original price. Used in: Breed, Repair.

8. **Content-shaped Skeletons** — Skeleton components matching the exact layout shapes of real content (slot row, info box, button). Used in: Vault, Marketplace, Breed, Repair.

9. **Phase Container + ChallengeHeader** — `phaseContainer` wrapper → `ChallengeHeader` (Avatar + name + subtitle) → phase-specific content. Used in: all 6 active game phase components.

### 3.3 Navigation Patterns

- **Bottom tab bar**: Material Top Tab Navigator positioned at bottom with custom `PageIndicator`
- **5 tabs**: Home (Poop), Vault, Breed, Repair, Profile
- **No stack navigation** — all screens are top-level tabs; no push/pop
- **BottomSheet**: used once for breed NFT picker (sub-selection)
- **Dialog**: used for confirmations (sign-out), celebrations (mystery box reveal), and info (stat allocation, marketplace "coming soon")
- **Swipe navigation**: enabled between tabs

---

## 4. INCONSISTENCY MAP

### 4.1 Same Component Used Differently

| Issue | Details | Files |
|---|---|---|
| **Tabs styling divergence** | Vault `Tabs.List` has custom tactile styling (`bg-surface border-[3px] border-outline border-b-[6px] rounded-full px-1 py-1` + custom `Tabs.Indicator` with border), while Marketplace `Tabs.List` uses bare HeroUI defaults (`self-center`) with default `Tabs.Indicator`. | Vault.tsx vs Marketplace.tsx |
| **Select trigger styling** | FilterControls: `h-[40px] py-0 bg-surface-container-low border-[3px] border-outline border-b-[6px] rounded-full px-4`. SortToolbar: `border-[2px] border-outline border-b-[3px] rounded-full`. Different border weights, no bg color. | controls.ts vs SortToolbar.tsx |
| **Card border pattern** | NFTCard uses 2-View split: `cardWrapper` (border, no overflow-hidden) + `cardContainer` (overflow-hidden, no border). BreedPickerItemCard puts `border-[3px]` directly on Card root. BreedOutcomePanel puts `border-[3px]` on Card via tv recipe. Three approaches to the same "bordered card" concept. | cards.ts, marketplace.ts, breed.ts |
| **Badge system** | NFTCard: `Chip` components + `badgePosition` recipe (absolute positioning variants). NFTDetailCard: plain `View` + `overlayBadge` recipe (different position offsets: top-2/left-2 vs top-3/left-3). Two separate badge positioning systems for the same visual concept. | badges.ts |
| **Button usage in action slots** | Vault uses raw `Button` + `cn(tactileButton({...}))` for card action buttons (list/open). All other screens use the `TactileButton` wrapper component. | Vault.tsx vs everywhere else |

### 4.2 Duplicate / Near-Duplicate Components

| Duplicate | Issue | Recommendation |
|---|---|---|
| **SortControls** → **SortToolbar** | `SortControls` is a 100% pass-through wrapper to `SortToolbar` — zero added logic. | Remove SortControls; use SortToolbar directly. |
| **FilterControls sort section** vs **SortToolbar** | FilterControls duplicates the sort dropdown + direction toggle internally instead of composing SortToolbar. They use different Select trigger styling too. | Compose SortToolbar inside FilterControls; unify Select styling. |
| **NFTCard** vs **NFTDetailCard** | Both display an NFT with image + badges + properties, but NFTDetailCard doesn't use HeroUI Card, uses different badge system (`overlayBadge` vs `badgePosition`+`Chip`), and has different layout structure. | Unify into one NFTCard with `size='grid' | 'detail'` variant. |
| **Progress bar pattern** ×3 | NFTProperties (PropertyBar), BreedOutcomePanel fill bars, and XP bar in NFTCard all implement the same "track + colored fill" pattern independently. | Extract a single `ProgressBar` component. |

### 4.3 Missing States per Screen

| Screen | Loading | Error | Empty | Notes |
|---|---|---|---|---|
| **Vault (NFTs tab)** | ✅ ScreenLoader | ✅ ScreenError | ❌ No explicit empty state | Grid renders nothing — user sees blank area |
| **Vault (Mystery Boxes tab)** | ❌ No skeleton | ❌ No error handling | ✅ Shows 0-count cards | Uses same loading/error as NFTs tab |
| **Marketplace (Buy tab)** | ✅ Skeleton | ❌ No error state | ❌ No empty state | Shows blank when no listings |
| **Marketplace (Sell tab)** | ✅ Skeleton | ❌ No error state | ✅ "No active listings" AlertBox | — |
| **Breed** | ✅ Skeleton | ✅ ScreenError | ✅ ScreenInfo (< 2 NFTs) | All states covered |
| **Repair** | ✅ Skeleton | ✅ ScreenError | ⚠️ Partial — picker shows "No NFTs Available" but no full empty state | — |
| **Poop** | ✅ ScreenLoader | ✅ ScreenError | ⚠️ Implicit — picker says "No NFTs Available" | No dedicated empty illustration/message |
| **Profile** | ⚠️ Skeleton for stats only | ❌ No error state | N/A | Wallet shows "—" during load; no error recovery |
| **InviteCodeScreen** | ✅ Spinner | ✅ FieldError | N/A | — |
| **Auth** | ✅ Spinner per button | ✅ Toast | N/A | — |

### 4.4 Other Inconsistencies

- **ScreenHeader** uses hardcoded inline className (`"absolute top-[60px] left-0 right-0 z-[99] h-12 items-center justify-center pointer-events-none"`) instead of a tv() recipe — the only component that breaks the 100% tv() convention.
- **Vault scroll-to-top button** uses raw `Button` + `cn(tactileNavButton(), ...)` with inline position overrides, while NFTSelector uses the same `tactileNavButton` recipe properly through the tv() system.
- **BreedPickerModal** uses `contentContainerStyle={{ padding: 16, paddingBottom: 40 }}` inline style instead of className — the only FlatList with this pattern.

---

## 5. DESIGN SYSTEM READINESS

### 5.1 What Already Follows Compound Patterns Correctly

| Area | Status | Details |
|---|---|---|
| **tv() recipe adoption** | ✅ Excellent | 100% of styles centralized in styles via tv() recipes. 30+ named recipes across 15 style files. |
| **CSS variable color system** | ✅ Excellent | All 41+ colors defined in global.css. Zero hardcoded hex/rgb in any component. HeroUI theme bridge layer properly maps semantic variables. |
| **Theme-aware color access** | ✅ Excellent | `useCSSVariable()` and `useRarityColors()` hooks handle all runtime color needs. Reactive to theme changes. |
| **HeroUI compound component API** | ✅ Excellent | Proper compound usage throughout (Card.Header/Body, Dialog.Portal/Overlay/Content, Slider.Track/Fill/Thumb, etc.) |
| **TactileButton abstraction** | ✅ Good | Well-designed wrapper with variant/size system, auto-wraps string children, passes through non-string children. Covers 90% of button uses. |
| **AlertBox abstraction** | ✅ Good | Clean wrapper with flexible description (string / string[] / falsy filtering). Used consistently for all status feedback. |
| **Accessibility** | ✅ Good | Consistent `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint` across interactive components. `accessibilityValue` on sliders and stat bars. |
| **Type safety** | ✅ Excellent | Discriminated unions (NFTType, NFTRarity) from @pop/shared used everywhere. All component props have TypeScript interfaces with JSDoc. |
| **Memoization** | ✅ Good | `React.memo()` on pure display components. `useCallback`/`useMemo` for expensive computations. |

### 5.2 What Needs Refactoring Before Migration

| Area | Scope | Effort | Description |
|---|---|---|---|
| **Typography scale** | High | Medium | Consolidate 20 distinct font sizes → 8–10 semantic tokens (`display-xl` through `caption-sm`). Create a `typography` tv() recipe or @theme tokens. |
| **Spacing scale** | High | Medium | Map arbitrary bracket values to design tokens. Define `--spacing-screen-top`, `--spacing-tab-clearance`, `--spacing-icon-gap`. Replace all `pt-[60px]`, `pb-[120px]`, `marginRight: 12` etc. |
| **Border radius tokens** | Medium | Low | Reduce 10 radius values → 4 tokens: `--radius-sm` (6–8px), `--radius-md` (12–14px), `--radius-lg` (16px), `--radius-full`. Eliminate `rounded-[14px]`, `rounded-[10px]`, `rounded-[24px]`. |
| **Border width normalization** | Low | Low | Standardize the 3D tactile system: primary `3px/6px`, secondary `2px/4px`, tertiary `2px/3px`. Currently 6+ combinations. |
| **Tabs styling unification** | Low | Low | Apply same tactile styling to both Vault and Marketplace Tabs.List. Create a shared `tactileTabs` tv() recipe. |
| **Select trigger unification** | Low | Low | Create one `tactileSelect` tv() recipe used by both FilterControls and SortToolbar. |
| **Card border pattern** | Medium | Medium | Unify the 3 card border approaches into one. Decide between wrapper-View approach or direct-border approach, and apply everywhere. |
| **Badge system unification** | Medium | Medium | Merge `badgePosition` and `overlayBadge` into one badge positioning system. Standardize on Chip-based badges vs View-based badges. |
| **SortControls/FilterControls dedup** | Low | Low | Remove SortControls wrapper. Make FilterControls compose SortToolbar. |
| **NFTCard / NFTDetailCard unification** | Medium | Medium | Merge into one component with a `size` variant or extract shared sub-components (badge overlay, image area). |
| **ProgressBar extraction** | Medium | Low | Extract the track+fill pattern used in NFTProperties, BreedOutcomePanel, and XP bar into a shared `ProgressBar` component. |
| **ScreenHeader → tv() recipe** | Low | Trivial | Move inline className to styles/shared/navigation.ts. |
| **Missing screen states** | Medium | Medium | Add empty states to Vault NFTs tab, Marketplace Buy tab. Add error states to Marketplace and Profile. |
| **Inline style→className** | Low | Low | Replace `style={{ marginRight: 12 }}` on icons with `className="mr-3"` (5–6 occurrences). Replace BreedPickerModal's `contentContainerStyle`. |

### 5.3 Estimated Scope Summary

| Category | Items | Migration Effort |
|---|---|---|
| **Token definition** (typography, spacing, radius, borders) | 4 workstreams | **~2 days** — define tokens in global.css, create tv() mapping recipes, search-and-replace across style files |
| **Component unification** (cards, badges, progress bars, controls) | 5 refactors | **~2–3 days** — requires updating component APIs and all consuming screens |
| **Missing states** (empty, error) | 5 screens | **~1 day** — simple AlertBox/ScreenInfo additions |
| **Cleanup** (inline styles, dedup, ScreenHeader) | 4 items | **~0.5 day** — mechanical changes |
| **Total pre-migration** | | **~5.5–6.5 days** |

### 5.4 What Can Be Carried Forward As-Is

- The entire color token system (global.css) — already design-system-ready
- The tv() recipe architecture — already the right pattern
- TactileButton and AlertBox wrappers — good abstraction layer
- The `font-black` / `font-bold` weight convention — just needs documenting
- All HeroUI compound component usage — already correct
- The phase-based game screen architecture — clean separation of concerns
- Accessibility attributes — already comprehensive