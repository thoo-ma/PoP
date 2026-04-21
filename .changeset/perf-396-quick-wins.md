---
"pop": patch
---

Performance quick wins (#396): wrap TactileButton, NFTDetailCard, AlertBox, BreedPickerItemCard, and proof phase components (IdlePhase, CountdownPhase, ChallengeHeader) in `React.memo`; convert NFTCard `action` prop to a render-prop so call-site memoization is preserved; add `useCallback` to BreedPickerModal `renderItem` and Repair screen handlers; parallelize multi-key cache invalidations in useBreedNFT, useOpenMysteryBox, and useUpdateNFT (list/unlist); replace redundant `supabase.auth.getUser()` round-trips with `getSession()` in useUserApproval, useUpdateNFT, useMarketplaceListings, and useWallet.
