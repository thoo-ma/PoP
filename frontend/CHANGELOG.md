# pop

## 0.5.0

### Minor Changes

- [#436](https://github.com/thoo-ma/PoP/pull/436) [`50ac253`](https://github.com/thoo-ma/PoP/commit/50ac25322e711b806cbcce13305477073647bdaf) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Accessibility hardening: add labels and values to sliders (StatAllocationModal, Repair), make BreedParentSlot announce as a button, label the InviteCodeScreen InputOTP, add a heading role to the screen header, announce AlertFrame content changes via a polite live region, hide decorative NFT images from screen readers, and expose expanded state on the filter toggle.

- [#428](https://github.com/thoo-ma/PoP/pull/428) [`d96e3bc`](https://github.com/thoo-ma/PoP/commit/d96e3bc9e005962f856c2f35a69c986e39b17ba7) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add useAnnounce hook and screen reader announcements for all Poop game phase transitions

- [#458](https://github.com/thoo-ma/PoP/pull/458) [`bab30b0`](https://github.com/thoo-ma/PoP/commit/bab30b037847ca1d7b0e67814ecd5ab626f98649) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add Zod response validation for edge function responses on the frontend. Response schemas live in `@pop/shared/rpc` and are enforced by `invokeEdgeFunction`, surfacing parse failures via a new `ResponseValidationError`.

### Patch Changes

- [#457](https://github.com/thoo-ma/PoP/pull/457) [`a8a7ac7`](https://github.com/thoo-ma/PoP/commit/a8a7ac7f162f8c7e7c64bc65b92701ab4a7925ad) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Polish batch ([#443](https://github.com/thoo-ma/PoP/issues/443)):

  - Render `ScreenLoader` `title` prop instead of silently dropping it ([#450](https://github.com/thoo-ma/PoP/issues/450))
  - Extract `useAuthForm` hook from `Auth.tsx` ([#447](https://github.com/thoo-ma/PoP/issues/447))
  - Replace `Math.random()` with `crypto.getRandomValues()`-backed `secureRandom()` in edge functions for game-economy outcomes ([#448](https://github.com/thoo-ma/PoP/issues/448))

- [#383](https://github.com/thoo-ma/PoP/pull/383) [`a27bb85`](https://github.com/thoo-ma/PoP/commit/a27bb853770dff59e08b73e2fd979669c4120226) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Enforce one-Alert-per-state pattern across all screens.

  Every status state (success, warning, empty, error) now maps to exactly one component used everywhere:

  - Breed at-limit and insufficient-POOP: ScreenError → Alert status="warning"
  - Repair success: repairSuccess() View/Text → Alert status="success"
  - Repair bust-inline: feedback moved outside NFT selection guard so it renders correctly
  - PromptPhase "Immobility confirmed!": infoCard + phaseText → Alert status="success"
  - RecordingPhase analyzing/recording/processing: infoCard states → Alert status="success"
  - ImmobilityPhase "Hold still": statusBadge ok → Alert status="success"
  - Marketplace empty sell tab: emptyState() → Alert status="warning"
  - DevPreviewRenderer: all catalog previews updated to match
  - Dead styles removed: repairSuccess, infoCard, recordingIndicator

- [#385](https://github.com/thoo-ma/PoP/pull/385) [`a47363f`](https://github.com/thoo-ma/PoP/commit/a47363f982aa9a89e252ec4e8bedb1e82956ba1a) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract shared AlertBox component to deduplicate 22 inline Alert instances across screens and components.

- [#440](https://github.com/thoo-ma/PoP/pull/440) [`07d106f`](https://github.com/thoo-ma/PoP/commit/07d106fd2e70fc19abf8d5334bd6b8470dcf9d99) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Audit and rationalize `frontend/constants/`, `utils/`, and `lib/`: move misclassified cooldown helpers (`formatCooldown`, `getCooldownStatus`, `CooldownStatus`) from `constants/` to `utils/proof/cooldown.ts`, co-locate single-consumer constants (`IMAGE_PLACEHOLDER_BG`, `IMAGE_TRANSITION_DURATION`, `SENSOR_UPDATE_INTERVAL`) and helpers (`formatConfidencePercentage`) with their owning files, and document folder conventions in `frontend/.instructions.md` (`constants/` = cross-cutting config & literal shared data; `utils/` = pure stateless helpers; `lib/` = third-party SDK init & API wrappers).

- [#438](https://github.com/thoo-ma/PoP/pull/438) [`dc9af66`](https://github.com/thoo-ma/PoP/commit/dc9af66a1cd2d03e4b5c842c956d6e9649cd5a93) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Audit and rationalize `frontend/types/`: delete dead types, co-locate single-consumer hook return types and component prop interfaces, move `ApprovalResult` RPC contract to `@pop/shared`, and document the convention (cross-cutting types only) in `frontend/.instructions.md`.

- [#437](https://github.com/thoo-ma/PoP/pull/437) [`81c036e`](https://github.com/thoo-ma/PoP/commit/81c036e21dcbe35f7e9dcec06af684ee1e53552e) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Audit and remove unnecessary `useCallback` wrappers in `frontend/`. Mutation hooks (`useAllocateStatPoints`, `useBreedNFT`, `useOpenMysteryBox`, `useRepairNFT`, `useUpdateNFT`) now expose React Query's already-stable `mutateAsync` directly; trivial empty-deps handlers in Vault, Marketplace, Poop, and Repair screens are inlined as plain functions. Load-bearing wrappers (FlatList memo boundaries, sensor subscriptions, state-machine bridges, async retry closures) are kept and annotated with `// kept: …` comments. No behaviour changes.

- [#386](https://github.com/thoo-ma/PoP/pull/386) [`1f4d223`](https://github.com/thoo-ma/PoP/commit/1f4d223ee4bebc052b1f2b8c050a5ce31fe64ef0) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Refactor frontend internals: group IdlePhase props into semantic objects, split oversized style files (feedback.ts, cards.ts) into focused modules, and standardize modal prop naming (isVisible, onDismiss).

- [#442](https://github.com/thoo-ma/PoP/pull/442) [`1d8df4b`](https://github.com/thoo-ma/PoP/commit/1d8df4bc3bc22ca89b52018553b0135673c24490) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Consolidate inline `supabase.functions.invoke` calls in NFT mutation hooks into a new `lib/edgeFunctions.ts` module with typed wrappers and centralised `FunctionsHttpError` parsing. Domain error classes (`BustedError`, `InsufficientPoopError`, `CooldownError`) now live in a single source of truth. Behaviour unchanged.

- [#387](https://github.com/thoo-ma/PoP/pull/387) [`916b0d3`](https://github.com/thoo-ma/PoP/commit/916b0d3db7efbcd2aeba0b1b10cc5a4adc266893) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Define semantic token scale (typography, spacing, border-radius, border-width) in global.css and update all tv() style recipes to use token-backed class names instead of arbitrary bracket values.

- [#391](https://github.com/thoo-ma/PoP/pull/391) [`85423c9`](https://github.com/thoo-ma/PoP/commit/85423c9c3efbcccbda78ec4e5672a3e83fd6f892) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Tokenize remaining arbitrary bracket values in style files (sizing, z-index, line-height, letter-spacing).

- [#384](https://github.com/thoo-ma/PoP/pull/384) [`672ee3f`](https://github.com/thoo-ma/PoP/commit/672ee3f4aad17c9b0a7be56326c97dee2ab9accc) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add 19 missing dev catalogue entries across Profile, Auth, Breed, Poop, Vault, and Marketplace sections.

- [#358](https://github.com/thoo-ma/PoP/pull/358) [`76d3285`](https://github.com/thoo-ma/PoP/commit/76d3285e8e5236e954d9e9916429d021edc96aa0) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Enable ccache for Android and iOS EAS builds, narrow Metro watchFolders to shared/ only.

- [#424](https://github.com/thoo-ma/PoP/pull/424) [`6a9d2cb`](https://github.com/thoo-ma/PoP/commit/6a9d2cb04498485863b0fc812a57c6febcc25ac9) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add shared EmptyState component and consolidate empty-state UX across screens.

- [#421](https://github.com/thoo-ma/PoP/pull/421) [`63ea4ca`](https://github.com/thoo-ma/PoP/commit/63ea4ca16f394b994de408a4487a9b251f9e537e) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace React Native Image with expo-image for disk caching and better memory management.

- [#425](https://github.com/thoo-ma/PoP/pull/425) [`ae05d9a`](https://github.com/thoo-ma/PoP/commit/ae05d9a3acfd4a9e2ce4acdbda15a94572fc3ccf) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract CooldownTimer component from Poop screen to own its own setInterval.

- [#423](https://github.com/thoo-ma/PoP/pull/423) [`e2f28ac`](https://github.com/thoo-ma/PoP/commit/e2f28ac3bee3c141bc05a20f607f2e9e31a80c29) Thanks [@thoo-ma](https://github.com/thoo-ma)! - refactor: extract usePoopStateMachine hook from Poop.tsx

- [#381](https://github.com/thoo-ma/PoP/pull/381) [`28c17d9`](https://github.com/thoo-ma/PoP/commit/28c17d983d4c370a829f935596ef638283d24858) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace manual collapsible pattern in DevCatalog with HeroUI Native Accordion; replace View divider in DegenBar with Separator.

- [#429](https://github.com/thoo-ma/PoP/pull/429) [`a52c572`](https://github.com/thoo-ma/PoP/commit/a52c57255f09282f234b88ac6a6068ff3f9effc8) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Design token & style hardening ([#394](https://github.com/thoo-ma/PoP/issues/394)): add `--border-tactile-sm/md/lg` (3/5/6px) scale and migrate every tactile call-site, eliminating the 4px outlier on `tactileNavButton`. Darken `--color-on-surface-variant` from `#b0a39d` (~2.2:1) to `#6b5d54` (~5.1:1) to meet WCAG AA. Extract `AlertBox` inline styles to a `tv()` recipe in `styles/shared/alertBox.ts`. Document the blessed spacing scale, tactile border convention, and muted-text font-weight pairing at the top of `global.css`.

- [#360](https://github.com/thoo-ma/PoP/pull/360) [`98c16c4`](https://github.com/thoo-ma/PoP/commit/98c16c4d964ffdca6301cef53474c2489b57512c) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Block dashboard, supabase, and google-cloud-run from Metro resolver to reduce startup time while keeping watchFolders at workspace root for correct monorepo entry resolution.

- [#435](https://github.com/thoo-ma/PoP/pull/435) [`5468d11`](https://github.com/thoo-ma/PoP/commit/5468d11f88666df8f0f0a00164ca50e6d9c09862) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Migrate the 6 NFT mutation hooks (`useBreedNFT`, `useOpenMysteryBox`, `useRepairNFT`, `useUpdateNFT`, `useAllocateStatPoints`, `usePoopNFT`) to React Query `useMutation`. Removes manual `useState` loading/error state, standardizes cache invalidation in `onSuccess`, and renames the public `loading` field to `isPending` (with consumer updates in `Breed`, `Vault`, `Repair`, `Poop`, and `StatAllocationModal`).

- [#430](https://github.com/thoo-ma/PoP/pull/430) [`d568dd4`](https://github.com/thoo-ma/PoP/commit/d568dd4069b82f8fe38fab25239d09fbca071635) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add blurhash placeholder support for NFT and mystery-box images. Exports `getNftBlurhash` / `getMysteryBoxBlurhash` helpers and `NFT_BLURHASHES` / `MYSTERY_BOX_BLURHASHES` lookup tables from `@pop/shared`. Adds `blurhash` column to `nfts` and `mystery_boxes` tables (Supabase migration included). Edge functions populate `blurhash` on insert. `RemoteImage` accepts a new `blurhash` prop that maps to expo-image's `placeholder={{ blurhash }}`, eliminating blank-flash on image load.

- [#427](https://github.com/thoo-ma/PoP/pull/427) [`42ae467`](https://github.com/thoo-ma/PoP/commit/42ae4671fd8d1f00ce9757209b1bb0d67697e284) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Performance quick wins ([#396](https://github.com/thoo-ma/PoP/issues/396)): wrap TactileButton, NFTDetailCard, AlertBox, BreedPickerItemCard, and proof phase components (IdlePhase, CountdownPhase, ChallengeHeader) in `React.memo`; convert NFTCard `action` prop to a render-prop so call-site memoization is preserved; add `useCallback` to BreedPickerModal `renderItem` and Repair screen handlers; parallelize multi-key cache invalidations in useBreedNFT, useOpenMysteryBox, and useUpdateNFT (list/unlist); replace redundant `supabase.auth.getUser()` round-trips with `getSession()` in useUserApproval, useUpdateNFT, useMarketplaceListings, and useWallet.

- [#378](https://github.com/thoo-ma/PoP/pull/378) [`464d174`](https://github.com/thoo-ma/PoP/commit/464d1743f04ffcaa119ca1ecfc9bc0b7ac6068ae) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Phase 2 HeroUI component upgrades: LinkButton footer links, InputOTP invite code, Avatar in ChallengeHeader, useToast across screens with retry actions, and Select/TagGroup style extraction into tv() recipe.

- [#390](https://github.com/thoo-ma/PoP/pull/390) [`7a89bab`](https://github.com/thoo-ma/PoP/commit/7a89bab8620ec61098ed5d98d46dda946124665c) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace inline style={{}} with className on icons and root views, add empty states for Vault NFTs and Marketplace Buy tabs, add error handling to Marketplace and ProfileScreen, and fix mystery box skeleton to match MysteryBoxCard layout.

- [#389](https://github.com/thoo-ma/PoP/pull/389) [`f1380a2`](https://github.com/thoo-ma/PoP/commit/f1380a250539f53104bada86eb9184831ae524aa) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Unify component patterns: BreedPickerItemCard wrapper+container card, tactileTabs/tactileSelect/screenHeader tv() recipes, replace raw Buttons with TactileButton, remove SortControls pass-through.

- [#433](https://github.com/thoo-ma/PoP/pull/433) [`6836615`](https://github.com/thoo-ma/PoP/commit/6836615c5f9cf88302544050a48e4d89ea82ec40) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Design-system polish (pre-redesign foundation, [#432](https://github.com/thoo-ma/PoP/issues/432)). Establish the
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

- [#379](https://github.com/thoo-ma/PoP/pull/379) [`ffb4766`](https://github.com/thoo-ma/PoP/commit/ffb47662ac901f487d345d6355757747dc4dce31) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add SearchField to Vault and Marketplace screens for filtering NFTs by name.

- [#388](https://github.com/thoo-ma/PoP/pull/388) [`63cdf24`](https://github.com/thoo-ma/PoP/commit/63cdf24630f9e09e4acec60da92f9def65ebeb72) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract shared ProgressBar and BadgeOverlay sub-components; migrate NFTDetailCard to HeroUI Card compound API.

- [#380](https://github.com/thoo-ma/PoP/pull/380) [`559a5d9`](https://github.com/thoo-ma/PoP/commit/559a5d986479a529efe8bb05e616302dc18188c5) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace ScreenLoader with content-shaped Skeleton placeholders in Breed and Repair screens.

- [#361](https://github.com/thoo-ma/PoP/pull/361) [`41fbbb9`](https://github.com/thoo-ma/PoP/commit/41fbbb9485f4c93ea17ff728a85d005653e7ca57) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add TactileButton wrapper component and migrate all call sites.

- [#426](https://github.com/thoo-ma/PoP/pull/426) [`c055b56`](https://github.com/thoo-ma/PoP/commit/c055b56f06f1751471cbd6274696db00bb8451e7) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Migrate Vault and Marketplace NFT grids from `ScrollView` + `.map()` to virtualized `FlatList` (`numColumns={2}`). Only visible cards are rendered, dramatically reducing component count and memory at larger collection / listing sizes. Filtering, sorting, search, tab switching, empty states, and the Vault scroll-to-top FAB are preserved. The Vault mystery-box grid (4 fixed items) is unchanged.

- Updated dependencies [[`dc9af66`](https://github.com/thoo-ma/PoP/commit/dc9af66a1cd2d03e4b5c842c956d6e9649cd5a93), [`d568dd4`](https://github.com/thoo-ma/PoP/commit/d568dd4069b82f8fe38fab25239d09fbca071635), [`bab30b0`](https://github.com/thoo-ma/PoP/commit/bab30b037847ca1d7b0e67814ecd5ab626f98649)]:
  - @pop/shared@0.3.0

## 0.4.0

### Minor Changes

- [#354](https://github.com/thoo-ma/PoP/pull/354) [`1ebda5c`](https://github.com/thoo-ma/PoP/commit/1ebda5c489148266b1fa1916532d3099d992962c) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add DevMockContext for auto-syncing dev previews. Introduce `DevMockProvider` and `useDevMock` in `frontend/lib/devMock.tsx`. Guard five Supabase-calling hooks (`useUserNFTs`, `useBreedNFT`, `useRepairNFT`, `useWallet`, `usePoopNFT`) so they short-circuit and return mock data when a `DevMockProvider` is in the tree. Replace ~40 hand-built JSX blocks in `DevPreviewRenderer` with real phase components (`IdlePhase`, `CountdownPhase`, `ImmobilityPhase`, `PromptPhase`, `RecordingPhase`, `ResultsPhase`) and real screens wrapped in `DevMockProvider` (`Breed`, `Repair`), so dev previews auto-sync whenever source components change.

### Patch Changes

- [#349](https://github.com/thoo-ma/PoP/pull/349) [`92e7c5b`](https://github.com/thoo-ma/PoP/commit/92e7c5b03b0085c20112e57a3544b47c964cdb7a) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Style BreedPickerModal cards with app-standard borders, remove title and bar separator.

- [#345](https://github.com/thoo-ma/PoP/pull/345) [`6687a02`](https://github.com/thoo-ma/PoP/commit/6687a02320a6ece894b1be195676a2dc6e405598) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Fix card border clipping and float screen header; tighten breed/outcome panel spacing.

- [#348](https://github.com/thoo-ma/PoP/pull/348) [`91f4d45`](https://github.com/thoo-ma/PoP/commit/91f4d451de07c1c019fa9c3365c162b9c8eddde7) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add Dev Catalog to Profile tab — collapsible sections of UI state previews covering all screens and hard-to-reach states (cooldown, no-energy, breed guard, all Poop game phases, etc.).

- [#352](https://github.com/thoo-ma/PoP/pull/352) [`00116a8`](https://github.com/thoo-ma/PoP/commit/00116a8443c38bb6e143d83c772439e7d9ba9f2c) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract BreedPickerItemCard and NFTDetailCard into standalone sub-components.

- [#355](https://github.com/thoo-ma/PoP/pull/355) [`a9631d3`](https://github.com/thoo-ma/PoP/commit/a9631d31b9dd68eb2baa19c3cb74d01878f6b5c1) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Reorganise frontend architecture: domain subfolders for styles/ and hooks/, single source of truth for sort taxonomy, normalise barrel imports.

- [#351](https://github.com/thoo-ma/PoP/pull/351) [`427789a`](https://github.com/thoo-ma/PoP/commit/427789a0ad06e47e98357c5b09efd0b38ae8d1af) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract Poop screen phase renderers into standalone sub-components under components/proof/.

- [#350](https://github.com/thoo-ma/PoP/pull/350) [`b6c08f8`](https://github.com/thoo-ma/PoP/commit/b6c08f87eb26afd2404ebf85176b15fe783b289c) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Move shared source files into src/, consolidate sub-path imports to barrel.

- Updated dependencies [[`b6c08f8`](https://github.com/thoo-ma/PoP/commit/b6c08f87eb26afd2404ebf85176b15fe783b289c)]:
  - @pop/shared@0.2.1

## 0.3.1

### Patch Changes

- [`2f82f29`](https://github.com/thoo-ma/PoP/commit/2f82f29be14a019e55330a4ba7a73e2cc7a5102b) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Wire useScrollToTop to all tab screens; fix MysteryBoxRevealModal, FilterControls, ProfileScreen, Vault, Breed, and Repair UI polish.

## 0.3.0

### Minor Changes

- [#283](https://github.com/thoo-ma/PoP/pull/283) [`ab0990c`](https://github.com/thoo-ma/PoP/commit/ab0990c10283756ec47bba42428fc12c74eeeb44) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Enable Google, X, and Apple OAuth sign-in for alpha release. Fix exchangeCodeForSession bug (parse auth code from callback URL). Add native Apple Sign-In via expo-apple-authentication (iOS only). Remove dead OAuth dialog.

### Patch Changes

- [#317](https://github.com/thoo-ma/PoP/pull/317) [`88c3de4`](https://github.com/thoo-ma/PoP/commit/88c3de4522b9b9a6baf7c97331d068220868c30a) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add app variants: dev client uses `.dev` bundle ID suffix, preview uses `.prev`, so both can coexist on device alongside production.

- [#334](https://github.com/thoo-ma/PoP/pull/334) [`0ba7bef`](https://github.com/thoo-ma/PoP/commit/0ba7befe8b262dd003438a4a9def750134fe5a39) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add Digital Atelier overlay and badge tokens to global.css.

- [#316](https://github.com/thoo-ma/PoP/pull/316) [`549379b`](https://github.com/thoo-ma/PoP/commit/549379b35ce06eb4d25e0921e48fb183a78d1574) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add OTA update handler: check for updates on launch, fetch and reload automatically.

- [#292](https://github.com/thoo-ma/PoP/pull/292) [`46024d6`](https://github.com/thoo-ma/PoP/commit/46024d6dbfbb3b2b4256b84d866b833ec7b16ae1) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Fix iOS deployment target (15.0 → 15.1) to satisfy ExpoModulesCore minimum requirement; set EAS iOS build image to `latest` so all build profiles always use the current Expo-recommended Xcode image (resolves Swift compiler/SDK version mismatch).

- [#297](https://github.com/thoo-ma/PoP/pull/297) [`a8693c4`](https://github.com/thoo-ma/PoP/commit/a8693c4af93d3cef54ef4730f5d39d9780d62420) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Fix X/Twitter OAuth sign-in by using correct provider name 'x' instead of deprecated 'twitter'.

- [#340](https://github.com/thoo-ma/PoP/pull/340) [`ac4a3e6`](https://github.com/thoo-ma/PoP/commit/ac4a3e64179c3cf53c78e3cdf57a02451c57bc80) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Post-redesign frontend audit: fix P0 bugs, remove dead code, migrate color constants to useCSSVariable.

- [#335](https://github.com/thoo-ma/PoP/pull/335) [`f8bf68d`](https://github.com/thoo-ma/PoP/commit/f8bf68dfe36f155a6f59129797f410ff19b00571) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace legacy non-semantic tokens with Digital Atelier semantic tokens across Session B style recipe files ([#333](https://github.com/thoo-ma/PoP/issues/333)).

- [#337](https://github.com/thoo-ma/PoP/pull/337) [`de68461`](https://github.com/thoo-ma/PoP/commit/de68461c825e3fba3263517302413d79ff5d5107) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace non-semantic inline tokens with semantic equivalents in screens and components (session C).

- [#337](https://github.com/thoo-ma/PoP/pull/337) [`2a16a3a`](https://github.com/thoo-ma/PoP/commit/2a16a3a34566ee22abc15d5776b9cb6e5a91cf00) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add app-\*-container status tokens to global.css and migrate status colors in game.ts and cards.ts.

- [#337](https://github.com/thoo-ma/PoP/pull/337) [`43cf795`](https://github.com/thoo-ma/PoP/commit/43cf795dd569da1310265924e12a997390ba09af) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Apply DA typographic and border language across all style recipes: font-black headings, border-[3px] on primary surfaces, shadow removal, and border-radius consistency.

- [#339](https://github.com/thoo-ma/PoP/pull/339) [`efa6a99`](https://github.com/thoo-ma/PoP/commit/efa6a999d3fd212a6c3b98e904cbb81268770962) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Bridge HeroUI Native CSS variables to Digital Atelier tokens via @layer theme in global.css. Remove obsolete design tokens (text palette, legacy surface variants, property bar, border, button) that have zero consumers.

- [#319](https://github.com/thoo-ma/PoP/pull/319) [`c0b1ef7`](https://github.com/thoo-ma/PoP/commit/c0b1ef74b7a374209b01b8167cc5b541238e00d5) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract tv() style recipes, apply theme tokens, and standardise tactile button props across screens.

- [#342](https://github.com/thoo-ma/PoP/pull/342) [`4aeca59`](https://github.com/thoo-ma/PoP/commit/4aeca5919b79f5b6d2faa99cabe8c33328061938) Thanks [@thoo-ma](https://github.com/thoo-ma)! - UI cohesiveness sweep: normalize layout containers, centralize styles, semantic color tokens, extract SortToolbar and ProfileModals, add accessibility labels and values.

## 0.2.1

### Patch Changes

- [#279](https://github.com/thoo-ma/PoP/pull/279) [`81755ab`](https://github.com/thoo-ma/PoP/commit/81755ab4fac831284754004848bca1bd3ab453ab) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Switch EAS to local versioning (appVersionSource: local), sync app.json version to 0.2.0, add buildNumber/versionCode fields, update version script to reset build numbers on version bump, and publish OTA updates to both production and preview channels on push to main.

## 0.2.0

### Minor Changes

- [#262](https://github.com/thoo-ma/PoP/pull/262) [`8bdc9bc`](https://github.com/thoo-ma/PoP/commit/8bdc9bc903caab0617cf52a15b0957655f65deea) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Upgrade Expo SDK 54 → 55 (React Native 0.83, React 19.2).

  - Bump all Expo packages to SDK 55-compatible versions
  - Migrate `expo-av` → `expo-audio` (hook-based `useAudioRecorder` API)
  - Remove deprecated `newArchEnabled` and `edgeToEdgeEnabled` from app.json
  - Add `expo-audio` and `expo-font` config plugins
  - Install missing peer deps: `expo-font`, `react-native-svg`, `expo-asset`
  - Bump Uniwind to 1.6.1 (Expo 55 compat)

- [#271](https://github.com/thoo-ma/PoP/pull/271) [`faad5be`](https://github.com/thoo-ma/PoP/commit/faad5be5f7c49cb78efd6ce8a9c2ffc3e1a430f4) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Replace 5 independent useUserNFTs() instances with TanStack React Query shared cache. Wire up Profile screen with real stats (detections, NFT count, days active). Remove manual nftEvents emitter.

- [#263](https://github.com/thoo-ma/PoP/pull/263) [`cca28da`](https://github.com/thoo-ma/PoP/commit/cca28da561ac189c1d84f7163cf7bb4b82073c85) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Upgrade TypeScript from 5.9 to 6.0 across all workspaces.

### Patch Changes

- [#251](https://github.com/thoo-ma/PoP/pull/251) [`214eca0`](https://github.com/thoo-ma/PoP/commit/214eca0336fc6646932846b6fea32aab8e3f36ce) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Extract duplicated edge function patterns into \_shared/ helpers (initHandler, fetchOwned, processPayment).

- [#229](https://github.com/thoo-ma/PoP/pull/229) [`9ab25e2`](https://github.com/thoo-ma/PoP/commit/9ab25e2384f0c765a21a9c9f68a28cc678f8d939) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add EAS mobile app build & submit workflows and version sync script.

- [#245](https://github.com/thoo-ma/PoP/pull/245) [`63f7426`](https://github.com/thoo-ma/PoP/commit/63f74267084df7912598b32a5d5815c9bcbff833) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Fix CORS on seed-dev-test-nfts error responses and add base64 format validation on detect-toilet-flush.

  Fixes [#241](https://github.com/thoo-ma/PoP/issues/241)

- [#259](https://github.com/thoo-ma/PoP/pull/259) [`09de04a`](https://github.com/thoo-ma/PoP/commit/09de04ad9a7e298cc751bb6ba9458bc63352dde6) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Bump heroui-native from RC (`^1.0.0-rc.4`) to stable (`^1.0.1`).

- [#260](https://github.com/thoo-ma/PoP/pull/260) [`78efb78`](https://github.com/thoo-ma/PoP/commit/78efb789a9f30e75956ed87c5941724f1504a90b) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Remove DB fetch layer and simplify game config to constants-only.

- [#252](https://github.com/thoo-ma/PoP/pull/252) [`0a9a474`](https://github.com/thoo-ma/PoP/commit/0a9a474e41112acf9e3e41bde129fd900c6e416d) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Remove redundant `parseDegenPercent` helper and dead try-catch blocks from `breed-nfts` and `repair-nft` edge functions.

  Both Zod schemas already validated `degen_percent` via `.default(0).optional()`, but the wrong chain order (`ZodOptional` wrapping `ZodDefault`) meant the field typed as `number | undefined` at runtime. `parseDegenPercent` existed solely to work around this by re-parsing with a duplicate schema. Fix: change to `.default(0)` (no `.optional()`), destructure `degen_percent` directly from `bodyResult`, and delete the helper and its surrounding dead code.

- [#249](https://github.com/thoo-ma/PoP/pull/249) [`33b827b`](https://github.com/thoo-ma/PoP/commit/33b827b414dc62a15cb8866f3b33cc5d198b1dfc) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Fix requireAuth returning 401 responses without dynamic CORS origin header.

- [#246](https://github.com/thoo-ma/PoP/pull/246) [`694d6f5`](https://github.com/thoo-ma/PoP/commit/694d6f59e45bd81b658e2f21d4a3e5b479491179) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add `MAX_STAT_VALUE` constant to `shared/statPoints.ts` and use it in `allocate-stat-points` instead of hardcoded `100`.

- [#248](https://github.com/thoo-ma/PoP/pull/248) [`b75ea08`](https://github.com/thoo-ma/PoP/commit/b75ea08d453a1e8fcc713029426cf9bd49c1f303) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add structured warnings field to partial-success edge function responses.

- Updated dependencies [[`78efb78`](https://github.com/thoo-ma/PoP/commit/78efb789a9f30e75956ed87c5941724f1504a90b), [`694d6f5`](https://github.com/thoo-ma/PoP/commit/694d6f59e45bd81b658e2f21d4a3e5b479491179), [`cca28da`](https://github.com/thoo-ma/PoP/commit/cca28da561ac189c1d84f7163cf7bb4b82073c85)]:
  - @pop/shared@0.2.0
