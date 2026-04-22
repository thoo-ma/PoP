---
"pop": patch
"edge-functions": patch
---

Polish batch (#443):

- Render `ScreenLoader` `title` prop instead of silently dropping it (#450)
- Extract `useAuthForm` hook from `Auth.tsx` (#447)
- Replace `Math.random()` with `crypto.getRandomValues()`-backed `secureRandom()` in edge functions for game-economy outcomes (#448)
