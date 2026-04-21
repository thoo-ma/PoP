---
"pop": patch
"@pop/shared": patch
---

Audit and rationalize `frontend/types/`: delete dead types, co-locate single-consumer hook return types and component prop interfaces, move `ApprovalResult` RPC contract to `@pop/shared`, and document the convention (cross-cutting types only) in `frontend/.instructions.md`.
