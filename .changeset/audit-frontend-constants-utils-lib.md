---
"pop": patch
---

Audit and rationalize `frontend/constants/`, `utils/`, and `lib/`: move misclassified cooldown helpers (`formatCooldown`, `getCooldownStatus`, `CooldownStatus`) from `constants/` to `utils/proof/cooldown.ts`, co-locate single-consumer constants (`IMAGE_PLACEHOLDER_BG`, `IMAGE_TRANSITION_DURATION`, `SENSOR_UPDATE_INTERVAL`) and helpers (`formatConfidencePercentage`) with their owning files, and document folder conventions in `frontend/.instructions.md` (`constants/` = cross-cutting config & literal shared data; `utils/` = pure stateless helpers; `lib/` = third-party SDK init & API wrappers).
