## Context

`tailwind-merge` (`^3.5.0`) is listed as a direct dependency in `frontend/package.json`, but **it is never imported directly anywhere in the frontend code**.

All className merging goes through `cn()` from `heroui-native`, which handles tailwind-merge internally. A code search for `from 'tailwind-merge'` and `from "tailwind-merge"` across `frontend/` returns **zero results**.

## Why

- Removing an unused direct dependency reduces the dependency surface and keeps `package.json` clean.
- `heroui-native` already bundles tailwind-merge under the hood via its `cn()` utility.
- One less package to track, audit, and keep up to date.

## Action

```bash
cd frontend
pnpm remove tailwind-merge
```

Then verify:
1. `pnpm typecheck` passes
2. App builds and runs — all `cn()` calls still work correctly
3. No runtime className merging regressions (spot-check components using `cn()`)

## Note

If heroui-native ever drops tailwind-merge from its internals, we'd need to re-add it. But for now it's safe to remove as a direct dep.