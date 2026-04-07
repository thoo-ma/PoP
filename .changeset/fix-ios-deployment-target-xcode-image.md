---
"pop": patch
---

Fix iOS deployment target (15.0 → 15.1) to satisfy ExpoModulesCore minimum requirement; set EAS iOS build image to `latest` so all build profiles always use the current Expo-recommended Xcode image (resolves Swift compiler/SDK version mismatch).
