# Dashboard Backlog

Audit performed: **2026-03-04**

---

## HIGH Priority

### 1. No error boundary — app white-screens on crash
- [ ] Create `src/app/error.tsx` (Next.js file convention) with a styled "Something went wrong" page + retry button
- [ ] Optionally add per-route `error.tsx` files for more granular recovery

### 2. No loading states
- [ ] Add `src/app/loading.tsx` with a skeleton/spinner
- [ ] Or wrap `{children}` in `<Suspense>` inside `AppShell.tsx`
- **Context:** `AppShell.tsx:11-13` fires `fetch()` on mount, but children render immediately with stale defaults

### 3. Supabase client typed unsafely
- [ ] Change `null as unknown as ReturnType<typeof createClient>` to `... | null` and enforce null checks at call sites
- **File:** `src/lib/supabase.ts:13`

### 4. No save/publish functionality
- [ ] Implement a `save` action in `src/store/gameConfigStore.ts` that upserts drafts to the `game_config` table
- [ ] Add a Save/Publish button to `src/components/layout/Header.tsx`
- **Context:** Store has `setDraft()` / `clearDrafts()` but no persistence — all edits lost on refresh

### 5. No authentication
- [ ] Add auth (Supabase Auth or simple password gate)
- [ ] Add RLS policies on `game_config`
- **Context:** Dashboard uses anon key, no login page, no auth guard

---

## MEDIUM Priority

### 6. Duplicated constants across 6+ pages
- [ ] Extract `RARITIES`, `RARITY_COLORS`, `TYPES`, `TYPE_COLORS` to `src/lib/constants.ts`
- [ ] Extract shared tooltip/axis styling to `src/lib/chartTheme.ts`
- **Affected files:** `currency/page.tsx`, `breed/page.tsx`, `stat-points/page.tsx`, `minting/page.tsx`, `energy/page.tsx`, `cooldown/page.tsx`

### 7. `stat-points/page.tsx` hardcodes `MAX_LEVEL = 20`
- [ ] Replace with `import { MAX_LEVEL } from '@pop/shared/xp'`
- **File:** `src/app/stat-points/page.tsx:16`

### 8. TypeScript `any` in LazyChart
- [ ] Replace `any` with `EChartsOption` or `Record<string, unknown>`
- **File:** `src/components/LazyChart.tsx:5,15,24`

### 9. Unsafe type assertion in minting page
- [ ] Remove `color: undefined as unknown as string` double cast hack
- **File:** `src/app/minting/page.tsx:65`

### 10. Accessibility gaps
- [ ] Link `<Label>` + `<Input>` pairs via `id`/`htmlFor` across all 10 pages (e.g. `xp/page.tsx:190-196`)
- [ ] Add `aria-pressed` to type selector buttons in `currency/page.tsx:176-186`
- [ ] Add text alternative to color-only validation in `breed/page.tsx:118`

### 11. No `not-found.tsx`
- [ ] Create styled 404 page matching dashboard theme at `src/app/not-found.tsx`

---

## LOW Priority / Quick Wins

### 12. Remove unused dependencies
- [ ] Remove `framer-motion` (~30KB gzipped, never imported)
- [ ] Remove `lucide-react` (never imported, sidebar uses emoji)
- [ ] Audit unused Radix packages (`react-slider`, `react-scroll-area`, `react-separator`, `react-tooltip`)

### 13. Inefficient Zustand selector
- [ ] Refactor `s.effective('key')` pattern to inline merge: `(s) => ({ ...s.config.key, ...s.drafts.key })`
- **Context:** `effective()` calls `get()` internally, defeating Zustand's shallow-equality optimization — every store change re-renders all pages

### 14. Break up `currency/page.tsx`
- [ ] Extract `RewardTab`, `RepairTab`, `BreedTab` sub-components to `src/components/currency/`
- **Context:** 593 lines with 3 tab components defined inline

### 15. Shared chart theme config
- [ ] Create `src/lib/chartTheme.ts` with common ECharts tooltip/axis/grid config
- **Context:** Every page duplicates ~15 lines (`backgroundColor: '#1a1a1a'`, `borderColor: '#333'`, etc.)

### 16. Tailwind config references nonexistent path
- [ ] Remove `./src/pages/**` from `tailwind.config.ts:6` content paths

### 17. No dirty state indicator
- [ ] Add "Unsaved changes" banner when `Object.keys(drafts).length > 0`
- [ ] Add navigation-away confirmation (e.g. `beforeunload`)

### 18. No input validation feedback
- [ ] Show inline error/toast when `handleChange` rejects invalid input silently
- **Example:** `loot/page.tsx:91`

### 19. Console statements in production
- [ ] Replace `console.warn`/`console.error` in `gameConfigStore.ts:119-130` with a proper logger or strip in prod

---

## Done

### ~~12. Remove unused dependencies~~ ✅ 2026-03-04
- Removed `framer-motion` (~30KB gzipped, never imported)
- Removed `lucide-react` (never imported, sidebar uses emoji)
- Removed 4 unused Radix packages: `react-scroll-area`, `react-separator`, `react-slider`, `react-tooltip`
- Deleted corresponding unused shadcn wrapper files: `tooltip.tsx`, `scroll-area.tsx`, `slider.tsx`, `separator.tsx`
- 39 packages removed from `node_modules`, build verified OK

### ~~13. Inefficient Zustand selector~~ ✅ 2026-03-04
- Replaced all 12 `s.effective('key')` selectors across 10 pages with inline merge: `(s) => ({ ...s.config.key, ...s.drafts.key })`
- Removed `effective` method and unused `get` param from `gameConfigStore.ts`
- Pages now only re-render when their specific config/draft slice changes, not on every store update

### ~~16. Tailwind config references nonexistent path~~ ✅ 2026-03-04
- Removed `./src/pages/**/*.{js,ts,jsx,tsx,mdx}` from `tailwind.config.ts` content paths (no `pages/` directory exists)
