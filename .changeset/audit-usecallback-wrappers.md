---
"pop": patch
---

Audit and remove unnecessary `useCallback` wrappers in `frontend/`. Mutation hooks (`useAllocateStatPoints`, `useBreedNFT`, `useOpenMysteryBox`, `useRepairNFT`, `useUpdateNFT`) now expose React Query's already-stable `mutateAsync` directly; trivial empty-deps handlers in Vault, Marketplace, Poop, and Repair screens are inlined as plain functions. Load-bearing wrappers (FlatList memo boundaries, sensor subscriptions, state-machine bridges, async retry closures) are kept and annotated with `// kept: …` comments. No behaviour changes.
