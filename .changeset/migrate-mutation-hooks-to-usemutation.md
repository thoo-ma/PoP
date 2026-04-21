---
"pop": patch
---

Migrate the 6 NFT mutation hooks (`useBreedNFT`, `useOpenMysteryBox`, `useRepairNFT`, `useUpdateNFT`, `useAllocateStatPoints`, `usePoopNFT`) to React Query `useMutation`. Removes manual `useState` loading/error state, standardizes cache invalidation in `onSuccess`, and renames the public `loading` field to `isPending` (with consumer updates in `Breed`, `Vault`, `Repair`, `Poop`, and `StatAllocationModal`).
