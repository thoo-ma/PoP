---
"pop": patch
---

Migrate Vault and Marketplace NFT grids from `ScrollView` + `.map()` to virtualized `FlatList` (`numColumns={2}`). Only visible cards are rendered, dramatically reducing component count and memory at larger collection / listing sizes. Filtering, sorting, search, tab switching, empty states, and the Vault scroll-to-top FAB are preserved. The Vault mystery-box grid (4 fixed items) is unchanged.
