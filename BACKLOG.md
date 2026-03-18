# Backlog

Items are grouped by priority tier and annotated with cross-references where fixing one item directly affects another.

---

## Tier 1 — Critical / Pre-launch Blockers

These must be resolved before any public release. They represent security holes, missing legal requirements, or data-integrity risks.

- [ ] **4.5** *(critical)* `detect-toilet-flush` edge function allows unauthenticated requests to proceed as `userId = 'anonymous'`, bypassing per-user rate limits — hard-fail with HTTP 401 when `user` is null in production. → also see **9.2** (no body-size guard makes this doubly dangerous)
- [ ] **4.2** Dev mode bypass (anonymous sign-in + `seed_dev_test_nfts` RPC) is client-side password-gated — ensure the RPC is strictly guarded server-side and cannot be abused in production.
- [ ] **4.2b** Remove dev mode password-gating (`EXPO_PUBLIC_DEV_MODE_PASSWORD`) before public release — `EXPO_PUBLIC_` vars are bundled in the JS binary and extractable.
- [ ] **4.3** OAuth redirect URI `'pop://'` is too broad in `utils/auth/urlHelpers.ts` — scope to `'pop://auth/callback'` and enforce strict path matching in the deep-link handler. → blocks **8.4** (router migration should happen first to own the deep-link handler)
- [ ] **P.11** Storage bucket RLS — tighten policies on the toilet-images bucket so only the owning user (or admins) can upload/delete; currently any authenticated user can delete any image.
- [ ] **P.12** Terms of service / Privacy Policy — required before App Store / Play Store submission. → blocks **P.13**

---

## Tier 2 — Architecture (unblock everything else)

These are structural decisions whose resolution removes blockers for multiple other items.

### NFT Data Layer *(5.1 = 8.1 — same root problem)*

- [ ] **5.1 / 8.1** Five independent `useUserNFTs()` instances (Vault, Breed, Marketplace, Repair, Poop) with no shared cache — introduce a React Context or React Query to share a single fetch and invalidation. This is a prerequisite for consistent state across **6.3 / P.6**, **5.5**, and the marketplace buy flow (**6.6 / P.10**).

### Routing

- [ ] **8.4** `FlatList` used as a page router — no back-gesture handling, no Android back button, no deep-link routing, no `Focus`/`Blur` lifecycle events — migrate to React Navigation or Expo Router. Fixing this also resolves **8.2** (subscriber teardown becomes natural on screen blur/unmount) and makes **4.3** (deep-link scoping) straightforward to enforce.

### Resilience

- [ ] **8.3** No React error boundaries anywhere in the tree — an unhandled render error white-screens the entire app; add `<ErrorBoundary>` around each screen.
- [ ] **8.8** No test framework — zero tests across the entire codebase; critical game-logic paths (breed probabilities, XP formula, cooldown calc, stat allocation) are entirely untested — add Jest + `@testing-library/react-native`.

---

## Tier 3 — Backend / Edge Functions

Security, correctness, and observability at the Supabase / Cloud Run layer.

- [ ] **9.2** No request-body size limit in any edge function — a large `audio_base64` payload is forwarded to Cloud Run unchecked; reject early with 413 at the edge layer. Compounds **4.5** (unauthenticated callers can flood Cloud Run for free).
- [ ] **9.4** JWT fallback in `breed-nfts` and `use-nft` decodes the token payload with `atob` without validating the signature (trust-on-presentation) — document this clearly and remove the fallback once the Expo Go tunnel reliability issue is resolved.
- [ ] **9.1** All four edge functions use `Access-Control-Allow-Origin: '*'` — tighten to a known client origin before production launch, coordinating with **4.3** (OAuth redirect scoping).
- [ ] **8.9** Edge Function response bodies (`detect-toilet-flush`, `breed-nfts`, `use-nft`, `allocate-stat-points`) are cast as typed values without runtime validation — adopt Zod schemas at these untyped boundaries.
- [ ] **6.14** All edge functions pin `std@0.168.0` — Deno standard library is now 0.220+; update to reduce security and compatibility risk.
- [ ] **9.8** `app.py` uses `print(..., flush=True)` throughout instead of structured logging — Cloud Run log severity, timestamps, and trace IDs are lost; migrate to `google.cloud.logging` or `structlog`.

---

## Tier 4 — Product Features

Grouped by feature area; items within each group are coupled.

### Marketplace
- [ ] **6.6 / P.10** Marketplace "Buy" flow is a stub (`Alert.alert('Coming Soon', ...)`) — implement or replace with an explicit "coming soon" UI state and remove the alert. Depends on **5.1 / 8.1** (shared NFT cache) to avoid stale data after a purchase.
- [ ] **5.5** `useMarketplaceListings` has no real-time subscription — listings go stale until the next full reload; add a `supabase.channel(...).on('postgres_changes', ...)` subscription.
- [ ] **P.7** Wallet integration — design on-chain flow (ERC-20 token credits, NFT minting, marketplace on-chain buy/sell). Depends on **P.10** being decided first.

### Profile
- [ ] **6.3 / P.6** `Profile.tsx` stats (`Detections`, `NFTs`, `Days Active`) are hardcoded to `0` and the page needs a full redesign — wire up real data fetching, add avatar, history summary, and rank. Both items resolve together via **5.1 / 8.1** (shared data layer).

### Core Game Loop
- [ ] **P.3** Wire up XP display alongside NFT level — `xp` field is already seeded in the database; complete the frontend XP bar for all screens.
- [ ] **P.4** Loot box mechanic — design and implement (open product decision: starter NFTs via toilet flush vs. loot box).
- [ ] **P.8** Refactor `ProofOfPoop.tsx` (480 lines) — extract the 5 phases into separate components (`SetupPhase`, `ImmobilityPhase`, `PromptPhase`, `RecordingPhase`, `ResultsPhase`). Best done after **8.4** (router migration) so each phase can be a proper screen.

### Platform
- [ ] **P.5** App icon — create and configure in `app.json`.
- [ ] **P.13** Deploy app in test mode (TestFlight / Google Play internal testing). Blocked by **P.12** (ToS / Privacy Policy) and **Tier 1** security items.

---

## Tier 5 — UX & Edge Cases

Flows that are broken or confusing but not crash-level.

- [ ] **7.3** `BreedPickerModal` renders a blank sheet when `allNFTs` is empty or all items are disabled — add an empty-state message. Related to **7.4**.
- [ ] **7.4** Breed screen does not check for at least one compatible pair before allowing entry — warn the user upfront if no valid combination exists with their current NFTs. Related to **7.3**.
- [ ] **7.5** No file-existence check before `file.base64()` in `useToiletDetection.ts` — add `FileSystem.getInfoAsync` before reading to give a user-friendly error when the OS has cleaned up the recording.
- [ ] **P.9** Repair screen UX — improve the flow between Vault and Repair so users can repair multiple NFTs in succession without navigating back and forth. Easier to address after **8.4** (router migration).
- [ ] **8.2** `nftEvents` in `nftEvents.ts` has no enforcement of subscriber teardown — consider adopting a structured pub-sub library (`mitt`) or at minimum document that the returned unsubscribe handle is mandatory. Largely resolved by **8.4** (screen lifecycle events).

---

## Tier 6 — Code Quality / Maintainability

Low-risk, high-clarity improvements with no external dependencies.

- [ ] **6.5** Vault price formula `(stat sum) / 400` uses magic numbers with no documentation — extract to named constants (`VAULT_PRICE_DIVISOR`) and add a comment explaining the pricing rationale.
- [ ] **5.3** `Dimensions.get('window').width` captured at module load in `App.styles.ts`, `BreedPickerModal.tsx`, and `Breed.styles.ts` — replace with `useWindowDimensions()` to support orientation changes, foldables, and web targets.

---

## Tier 7 — Deployment & Documentation

`DEPLOYMENT.md` is incomplete; these gap-fill items are required before handing the project to any new deployer.

- [ ] **10.1** `DEPLOYMENT.md` contains placeholder values (`YOUR_API_KEY`, `https://yamnet-detector-xxxxx-uc.a.run.app`) — add a `.env.deploy.example` template or a sed-substitution step so deployers cannot miss them.
- [ ] **10.2** `DEPLOYMENT.md` has no rollback instructions for database migrations — document `supabase db reset` or manual down-migration steps for each migration file.
- [ ] **10.3** `DEPLOYMENT.md` does not document how to configure frontend environment variables (Supabase URL and anon key) — add a section covering `app.json` / `expo-constants` / EAS secret setup.
- [ ] **10.4** `DEPLOYMENT.md` prerequisites do not mention the Supabase CLI or that `supabase login` and a valid `config.toml` are required before `supabase db push`.

---

## Dependency Map

```
Tier 1 security (4.2, 4.3, 4.5, P.11, P.12)
    └─ P.13 (store release)

8.4 (router migration)
    ├─ 4.3 (deep-link scoping)
    ├─ 8.2 (event teardown)
    └─ P.8 (ProofOfPoop phases as screens)
         └─ P.9 (Repair UX flow)

5.1 / 8.1 (shared NFT data layer)
    ├─ 6.3 / P.6 (profile stats)
    ├─ 5.5 (real-time marketplace)
    └─ 6.6 / P.10 (marketplace buy flow)
              └─ P.7 (wallet / on-chain)

4.5 (unauth edge function) + 9.2 (no body size limit)  ← fix together

8.9 (Zod validation) → applied across all four edge functions (9.4, 9.1 area)

P.12 (ToS) → P.13 (test flight)
```
