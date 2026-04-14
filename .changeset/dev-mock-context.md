---
"pop": minor
---

Add DevMockContext for auto-syncing dev previews. Introduce `DevMockProvider` and `useDevMock` in `frontend/lib/devMock.tsx`. Guard five Supabase-calling hooks (`useUserNFTs`, `useBreedNFT`, `useRepairNFT`, `useWallet`, `usePoopNFT`) so they short-circuit and return mock data when a `DevMockProvider` is in the tree. Replace ~40 hand-built JSX blocks in `DevPreviewRenderer` with real phase components (`IdlePhase`, `CountdownPhase`, `ImmobilityPhase`, `PromptPhase`, `RecordingPhase`, `ResultsPhase`) and real screens wrapped in `DevMockProvider` (`Breed`, `Repair`), so dev previews auto-sync whenever source components change.
