---
"pop": patch
---

Consolidate inline `supabase.functions.invoke` calls in NFT mutation hooks into a new `lib/edgeFunctions.ts` module with typed wrappers and centralised `FunctionsHttpError` parsing. Domain error classes (`BustedError`, `InsufficientPoopError`, `CooldownError`) now live in a single source of truth. Behaviour unchanged.
