# edge-functions

## 0.1.2

### Patch Changes

- [#457](https://github.com/thoo-ma/PoP/pull/457) [`a8a7ac7`](https://github.com/thoo-ma/PoP/commit/a8a7ac7f162f8c7e7c64bc65b92701ab4a7925ad) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Polish batch ([#443](https://github.com/thoo-ma/PoP/issues/443)):

  - Render `ScreenLoader` `title` prop instead of silently dropping it ([#450](https://github.com/thoo-ma/PoP/issues/450))
  - Extract `useAuthForm` hook from `Auth.tsx` ([#447](https://github.com/thoo-ma/PoP/issues/447))
  - Replace `Math.random()` with `crypto.getRandomValues()`-backed `secureRandom()` in edge functions for game-economy outcomes ([#448](https://github.com/thoo-ma/PoP/issues/448))

- [#430](https://github.com/thoo-ma/PoP/pull/430) [`d568dd4`](https://github.com/thoo-ma/PoP/commit/d568dd4069b82f8fe38fab25239d09fbca071635) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Add blurhash placeholder support for NFT and mystery-box images. Exports `getNftBlurhash` / `getMysteryBoxBlurhash` helpers and `NFT_BLURHASHES` / `MYSTERY_BOX_BLURHASHES` lookup tables from `@pop/shared`. Adds `blurhash` column to `nfts` and `mystery_boxes` tables (Supabase migration included). Edge functions populate `blurhash` on insert. `RemoteImage` accepts a new `blurhash` prop that maps to expo-image's `placeholder={{ blurhash }}`, eliminating blank-flash on image load.

## 0.1.1

### Patch Changes

- [#350](https://github.com/thoo-ma/PoP/pull/350) [`b6c08f8`](https://github.com/thoo-ma/PoP/commit/b6c08f87eb26afd2404ebf85176b15fe783b289c) Thanks [@thoo-ma](https://github.com/thoo-ma)! - Move shared source files into src/, consolidate sub-path imports to barrel.
