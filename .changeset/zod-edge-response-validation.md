---
"pop": minor
"@pop/shared": minor
---

Add Zod response validation for edge function responses on the frontend. Response schemas live in `@pop/shared/rpc` and are enforced by `invokeEdgeFunction`, surfacing parse failures via a new `ResponseValidationError`.
