# PoP — Agent Instructions

Monorepo for an NFT-based mobile game (detect toilet flushes via on-device audio). pnpm workspaces + Turborepo.

## Build / Lint / Typecheck

| Command | What it does |
|---|---|
| `pnpm install` | Install all deps (from root) |
| `pnpm biome check --staged --write --no-errors-on-unmatched` | Pre-commit hook — auto-formats + lints staged files |
| `pnpm lint` | Biome lint across the whole repo |
| `pnpm format` | Biome format (auto-fix) |
| `pnpm typecheck` | `turbo run typecheck` — full tsc across all workspaces |
| `pnpm build` | `turbo run build` — builds all packages |
| `pnpm typecheck --filter=frontend` | Typecheck only frontend |
| `pnpm typecheck --filter=dashboard` | Typecheck only dashboard |
| `pnpm typecheck --filter=@pop/shared` | Typecheck only shared |

Husky hooks: pre-commit runs `biome check --staged --write`, pre-push runs `pnpm typecheck`. No `--no-verify`. No force-push.

## Testing

No test framework is configured. There are no test files in this repo. Do not assume vitest, jest, or any runner exists.

## Monorepo Layout

| Package | Path | Runtime | Key Dependencies |
|---|---|---|---|
| `pop` (frontend) | `frontend/` | React Native + Expo 55 | HeroUI Native, Uniwind (TW v4), TanStack React Query, Zod |
| `dashboard` | `dashboard/` | Next.js 15 (App Router) | Radix UI, shadcn/ui, Tailwind v3, Zustand 5, Zod |
| `@pop/shared` | `shared/` | Raw TS (no build step) | Zod |
| supabase functions | `supabase/functions/` | Deno | Supabase JS, Zod |
| google-cloud-run | `google-cloud-run/` | Python + Flask | TensorFlow, YAMNet |

## Code Style

### Biome (all .ts/.tsx in frontend/, shared/, dashboard/src/)

- `indentStyle: space`, `indentWidth: 2`, `lineWidth: 100`
- `quoteStyle: single`, `semicolons: asNeeded`, `trailingCommas: all`
- `arrowParentheses: always`, `lineEnding: lf`
- Biome checks run in pre-commit hook — fix before pushing.

### TypeScript (tsconfig.base.json)

- `strict: true`, `moduleResolution: bundler`, `allowImportingTsExtensions: true`
- `noEmit: true`, `isolatedModules: true`, `target: ES2020`, `module: ESNext`
- Path aliases: `@/*` → `./*` (frontend), `@/*` → `./src/*` (dashboard), `@pop/shared` → `../shared/src/`

### Imports

- Barrel exports in every subdirectory (`index.ts`). New modules must be re-exported there.
- Use path aliases (`@/components/ui/Button`, `@pop/shared/cooldown`), not relative paths that traverse up.
- Import types with `import type { ... }` syntax.
- Always use `queryKeys` from `@/constants/queryKeys` — never raw string query keys.
- **Restricted**: importing `heroui-native` directly outside `frontend/components/ui/`. Import from `@/components/ui` instead.

### Naming

- **Files**: PascalCase for components (`Button.tsx`, `NFTCard.tsx`), camelCase for utilities (`queryKeys.ts`, `errorHelpers.ts`). Prefix hooks with `use` (`useUserNFTs.ts`).
- **Exports**: Named exports only (no default exports). Components use `export const` (or `export function` for hooks).
- **Types**: PascalCase. Local types co-located with file; cross-cutting types in `types/`. Discriminated union types (`NFTType`, `NFTRarity`) from `@pop/shared` — never `string`.
- **Zod schemas**: PascalCase with `Schema` suffix (`CurrencyConfigSchema`).

### React Native (frontend/) Patterns

- Every exported component wrapped in `React.memo` (unless it accepts `children` or reads context — document with a comment).
- `useCallback` for callback props passed to memoized children. `useMemo` for derived values.
- `FlatList` for any list > ~10 items (never `ScrollView` + `.map()`).
- `expo-image` for all images (never `Image` from `react-native`).
- `cn()` from `heroui-native` (not from local utils) to merge classNames.
- HeroUI wrappers in `components/ui/` bake brand defaults. New wrappers added only when 2nd consumer exists.
- Styling: Uniwind (TW v4) `className` + `tv()` recipes in `layouts/`. Color tokens in `global.css` `@theme` block.

### Dashboard (dashboard/) Patterns

- `cn()` from `@/lib/utils` (clsx + twMerge). `cva()` for variants (shadcn pattern). No `tv()`.
- `'use client'` directive on interactive pages. Zustand with `useShallow` for selector stability.
- Supabase client may be `null` during SSG/build — always guard `if (!supabase)`.
- Charts lazy-loaded via `LazyChart` component.

### Error Handling

- `logError(context, error)` — logs with context prefix and sends to monitoring (future).
- `getErrorMessage(error, fallback?)` — extracts user-friendly message from any error type.
- `useErrorHandler(context)` hook — returns `{ error, handleError, clearError }`.
- Zod validation at system boundaries (Supabase edge functions, API responses). Never manual casting.
- Edge functions return `{ error: EdgeFunctionErrorCode, message, details? }`.

### State Management

- **Frontend**: TanStack React Query for all server state. React Context for client state. No Zustand.
- **Dashboard**: Zustand 5 for game config state. TanStack React Query for server state.

### Git

- **Branch naming**: `<prefix>/<kebab-case>` — prefix in {fix, feat, refactor, chore, docs, ui, ux, perf, security, test, tv, heroui, config}. With issue: `security/42-harden-cors`.
- **Commits**: `<prefix>: <description>`. Body includes `Fixes #<n>` when closing issue.
- **Changesets**: Every PR touching workspace code must include a changeset. See `.github/skills/changeset/`.

### Accessibility (frontend/)

- Every interactive element: `accessibilityLabel`. Screen titles: `accessibilityRole="header"`. Dynamic changes: `accessibilityLiveRegion="polite"`.
- Decorative images: `accessible={false}`.

### Config & Constants

- No hardcoded balance numbers — always read from `@pop/shared`.
- `new Date().toISOString()` for dates passed to DB.

## Skills (load via skill tool)

- `operations` — deployment, CI/CD, secrets, release
- `game-config` — game balance config-as-code
- `heroui-native` — HeroUI component library docs
- `tailwind-variants` — tv() pattern extraction
- `uniwind` — Tailwind v4 styling for RN
- `turborepo` — monorepo build system
- `changeset` — changeset conventions
