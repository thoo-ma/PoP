---
"pop": minor
---

Upgrade Expo SDK 54 → 55 (React Native 0.83, React 19.2).

- Bump all Expo packages to SDK 55-compatible versions
- Migrate `expo-av` → `expo-audio` (hook-based `useAudioRecorder` API)
- Remove deprecated `newArchEnabled` and `edgeToEdgeEnabled` from app.json
- Add `expo-audio` and `expo-font` config plugins
- Install missing peer deps: `expo-font`, `react-native-svg`, `expo-asset`
- Bump Uniwind to 1.6.1 (Expo 55 compat)
