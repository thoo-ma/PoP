---
"pop": patch
---

Remove redundant `parseDegenPercent` helper and dead try-catch blocks from `breed-nfts` and `repair-nft` edge functions.

Both Zod schemas already validated `degen_percent` via `.default(0).optional()`, but the wrong chain order (`ZodOptional` wrapping `ZodDefault`) meant the field typed as `number | undefined` at runtime. `parseDegenPercent` existed solely to work around this by re-parsing with a duplicate schema. Fix: change to `.default(0)` (no `.optional()`), destructure `degen_percent` directly from `bodyResult`, and delete the helper and its surrounding dead code.
