---
"@pop/shared": minor
"pop": patch
"edge-functions": patch
---

Add blurhash placeholder support for NFT and mystery-box images. Exports `getNftBlurhash` / `getMysteryBoxBlurhash` helpers and `NFT_BLURHASHES` / `MYSTERY_BOX_BLURHASHES` lookup tables from `@pop/shared`. Adds `blurhash` column to `nfts` and `mystery_boxes` tables (Supabase migration included). Edge functions populate `blurhash` on insert. `RemoteImage` accepts a new `blurhash` prop that maps to expo-image's `placeholder={{ blurhash }}`, eliminating blank-flash on image load.
