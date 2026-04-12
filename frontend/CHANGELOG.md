# pop

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
