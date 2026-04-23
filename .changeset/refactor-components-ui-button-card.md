---
"pop": patch
---

Add `components/ui/Button` and `components/ui/Card` wrappers as the sanctioned import path for HeroUI Native's `Button` and `Card`. Bake the brown tactile press animation into `Button` and brand outline + `rounded-card` defaults into `Card`. Add a Biome `noRestrictedImports` rule (warn level) flagging direct `heroui-native` imports outside `frontend/components/ui/`.
