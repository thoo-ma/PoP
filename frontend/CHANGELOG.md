# pop

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
