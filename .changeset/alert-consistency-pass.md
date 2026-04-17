---
"pop": patch
---

Enforce one-Alert-per-state pattern across all screens.

Every status state (success, warning, empty, error) now maps to exactly one component used everywhere:
- Breed at-limit and insufficient-POOP: ScreenError → Alert status="warning"
- Repair success: repairSuccess() View/Text → Alert status="success"
- Repair bust-inline: feedback moved outside NFT selection guard so it renders correctly
- PromptPhase "Immobility confirmed!": infoCard + phaseText → Alert status="success"
- RecordingPhase analyzing/recording/processing: infoCard states → Alert status="success"
- ImmobilityPhase "Hold still": statusBadge ok → Alert status="success"
- Marketplace empty sell tab: emptyState() → Alert status="warning"
- DevPreviewRenderer: all catalog previews updated to match
- Dead styles removed: repairSuccess, infoCard, recordingIndicator
