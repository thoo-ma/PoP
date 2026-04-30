# Design System Storybook — Backlog

## Done

| Component | File | Groups |
|---|---|---|
| Button | `ui/Button.stories.tsx` | Variants, Disabled, Sizes, With Icon |
| Card | `ui/Card.stories.tsx` | Card‑only (Profile), Grid Cards, Panels |

---

## Tier 1 — Design System Primitives (HeroUI wrappers)

Highest reusability — used across screens. Each gets a co-located `.stories.tsx`.

| Priority | Component | Source | What to show |
|---|---|---|---|
| 1 | Alert | `ui/Alert.tsx` | 6 status variants (success, warning, danger, info, accent, error), with/without title, with/without children |
| 2 | Chip | `ui/Chip.tsx` | 5 variants × 3 sizes, colors, with/without label, with/without icon |
| 3 | Spinner | `ui/Spinner.tsx` | 3 sizes (sm, md, lg), color accent override |
| 4 | Avatar | `ui/Avatar.tsx` | 4 sizes, with Image vs Fallback initials, color variants |
| 5 | Dialog | `ui/Dialog.tsx` | Open state with compound parts (Portal, Overlay, Content, Title, Description, Close) |
| 6 | PressableFeedback | `ui/PressableFeedback.tsx` | 4 variants (scale, highlight, ripple, none), pressed state |
| 7 | Select | `ui/Select.tsx` | Open/closed, Trigger + Value + Item rows, single vs multiple |
| 8 | Slider | `ui/Slider.tsx` | Track + Fill + Thumb, disabled state |
| 9 | TagGroup | `ui/TagGroup.tsx` | With items, selected state, removable |
| 10 | ProgressBar | `shared/ProgressBar.tsx` | sm vs md size, color vs colorClass, empty/partial/full |
| 11 | BadgeOverlay | `shared/BadgeOverlay.tsx` | 5 positions, label sizes, with Chip color |
| 12 | EmptyState | `shared/EmptyState.tsx` | inline vs screen layout, with/without icon/description/action |

**Level of effort per component**: ~30 min (story file) + 2 lines (registry) + 1 line (catalog entry)

---

## Tier 2 — Domain Components

Lower reusability but still valuable for visual reference.

| Priority | Component | Source | What to show |
|---|---|---|---|
| 13 | NFTCard | Already in DevPreviewRenderer as `component:nft-card` — consider migrating to `.stories.tsx` format with 4 rarities |
| 14 | NFTProperties | `nft/NFTProperties.tsx` | compact vs detailed mode, with/without energy, with excluded properties |
| 15 | NFTDetailCard | `nft/NFTDetailCard.tsx` | With image + stats + badges |
| 16 | MysteryBoxCard | Already in DevPreviewRenderer — consider migrating |
| 17 | BreedOutcomePanel | `breed/BreedOutcomePanel.tsx` | Rarity pair probabilities, some rows hidden at 0% |
| 18 | BreedParentSlot | `breed/BreedParentSlot.tsx` | Empty vs filled with NFT |
| 19 | BreedPickerItemCard | `breed/BreedPickerItemCard.tsx` | Normal, disabled, isSelected |
| 20 | DegenBar | Already in DevPreviewRenderer as `component:degen-bar` — consider migrating |
| 21 | ScreenLoader | `shared/ScreenLoader.tsx` | Bare, with title, with title + message |
| 22 | ScreenError | `shared/ScreenError.tsx` | With/without retry button |
| 23 | OAuthButton | `auth/OAuthButton.tsx` | All 3 providers (google, x, apple), loading, disabled |

---

## Tier 3 — Game Phase Components (already covered by screen-level previews)

These are complex composed components already visible in the `poop:*` and `auth:*` screen previews. Lower priority for individual story entries.

| Component | Covered by screen-level entry |
|---|---|
| ChallengeHeader | `poop:idle-ready` |
| CooldownTimer | `poop:idle-cooldown` |
| CountdownPhase | `poop:countdown` |
| IdlePhase | `poop:idle-*` |
| ImmobilityPhase | `poop:immobility-*` |
| PromptPhase | `poop:prompt` |
| RecordingPhase | `poop:recording` |
| ResultsPhase | `poop:result-*` |
| RoulettePhase | `poop:roulette` |
| Auth/Auth | `auth:sign-in-*` |
| BreedOutcomePanel | breed screen-level entries |
| BreedParentSlot | breed screen-level entries |
| BreedPickerModal | breed screen-level entries |
| LootRouletteCard | `component:loot-roulette` |
| MysteryBoxRevealModal | `component:mystery-box-reveal` |
| StatAllocationModal | profile screen-level entries |
| NFTSelector | covered by NFTCard stories |

---

## Exported components (not for stories)

| Component | Reason |
|---|---|
| ScreenHeader | Trivial — just title text |
| SortToolbar | Too complex to mock (driven by screen state) |
| PageIndicator | Depends on navigation state |
| FilterControls | Too complex to mock (driven by filter state) |
| ErrorBoundary | Requires throwing an error to demonstrate |
| Separator | Too trivial |
| FieldError | Only relevant inside forms |
| InputOTP | Only relevant inside forms |
| SearchField | Only relevant inside forms |
| LinkButton | Redundant with Button |
| DevCatalog | Dev-only tooling, not for storybook |

---

## Migration candidates

5 components are currently rendered directly in `DevPreviewRenderer.tsx` as `component:*` entries. Consider migrating them to `.stories.tsx` format for consistency:

| Current entry | Current format | Complexity |
|---|---|---|
| `component:nft-card` | 4 rarities in a 2×2 grid | Medium — needs mock NFT data |
| `component:mystery-box-card` | 4 rarities in a 2×2 grid | Medium — needs mock box data |
| `component:degen-bar` | Interactive slider preview | High — stateful component |
| `component:loot-roulette` | Interactive LootRouletteCard | High — stateful + multi-state |
| `component:mystery-box-reveal` | MysteryBoxRevealModal | Medium — modal overlay |

---

## Adding a new story (recipe)

1. Create `frontend/components/<domain>/<Component>.stories.tsx` exporting `componentStories: ComponentStory`
2. Register in `DesignSystemRenderer.tsx` `getStory()` switch: `case 'ds:<name>': return require(...)`
3. Add entry in `DevCatalog.tsx` CATALOG array: `['ds:<name>', '<Display Name>']`
4. Run `pnpm typecheck --filter=pop`
