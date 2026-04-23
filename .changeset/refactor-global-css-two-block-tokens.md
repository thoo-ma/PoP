---
"pop": patch
---

Refactor `global.css` to three-block structure with complete HeroUI semantic var coverage in OKLCH. Lock theme to light at boot via `Uniwind.setTheme('light')`. Add `check:theme` CI gate that diffs HeroUI Native's required vars against `frontend/global.css`. No visual change — legacy MD3 token names continue to compile via a deprecated alias bridge.
