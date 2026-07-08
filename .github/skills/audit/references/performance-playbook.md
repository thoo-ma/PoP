# Performance Playbook

You are auditing render, list, animation, memory, and startup performance in a React Native codebase. Your subagent scope is *performance only* — bundle-size architecture questions belong here, but styling consistency and a11y do not.

Structure the "Detailed audit" section of your report using the subsection headers below.

---

## Render performance

**Memoization coverage.** For each component observed in a hot path (frequently mounted, list item, screen-level container): wrapped in `React.memo` where appropriate? Props stable (primitives, memoized objects/functions)? Would it re-render when its parent re-renders unnecessarily? List every component likely to cause cascade re-renders.

**Hooks.** For each custom hook and each component using hooks: expensive computations wrapped in `useMemo`? Callbacks wrapped in `useCallback` where passed as props to memoized children? Dependency arrays correct — no missing deps, no over-deps? Hooks creating new objects/arrays on every render? Any hook whose dependency array is wrong is a finding.

**Context re-render risk.** For each React Context: value provided, how frequently it changes, how many components consume, whether the context is split appropriately (high-frequency vs low-frequency values in the same provider is a common issue). Would a single change re-render the entire tree?

**State updates.** State updates triggering more re-renders than necessary? Multiple `setState` calls batched or sequential? Derived values computed on render vs memoized? Any `setState` inside render paths?

---

## List and scroll performance

Lists are the highest-risk area in React Native performance. Audit every list.

**List component choice.** For each list: what is used (`FlatList`, `SectionList`, `ScrollView` + `.map()`, `FlashList`)? Is `ScrollView` + `map()` used where a virtualized list should be? Expected data size (small / medium / large / unbounded)?

**List config.** `keyExtractor` defined and returning stable unique keys? `getItemLayout` or `estimatedItemSize` (FlashList) defined? `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews` configured appropriately?

**List items.** For each list item component: memoized with `React.memo`? Props stable — no inline objects, no inline functions from the parent? Does the item do expensive work on render? Images in list items handled for performance (correct component, correct sizing, caching)?

**Scroll handlers.** Any `onScroll` handlers — what do they do? Throttled or using `useNativeDriver`? Layout effects triggered by scroll position? Expensive computations in scroll handlers?

---

## Animation performance

Animations should run on the native thread. Anything on the JS thread is a finding unless there is a specific reason.

**Library usage.** What animation libraries are in use (Reanimated v2/v3, `Animated` API, Moti, `LayoutAnimation`)? Animations using `useNativeDriver: true` wherever possible? `Animated.Value` operations on the JS thread that could move native?

**Reanimated.** For each Reanimated animation: worklets used correctly? Shared values accessed only from worklets or the UI thread? JS-thread interactions inside worklet functions? Gesture handlers connected directly to animations without JS-thread involvement?

**Complexity.** Animations running every frame? Animations triggered by state changes that cause re-renders? Layout animations — necessary? Animations blocking user interaction?

**Gestures.** What gesture library (Gesture Handler, Pan Responder)? Gestures handled natively or through JS callbacks? Gesture conflicts causing dropped frames? Simultaneous handlers configured correctly?

---

## Image and asset performance

**Loading.** How remote images are loaded and displayed. Caching in place. Images loaded at resolution appropriate for display size, or full-res images shown in thumbnail-sized views? Images loaded but never displayed?

**Components.** What image components in use (`Image`, `FastImage`, `expo-image`, other)? Placeholder/loading states during fetch? Images in lists recycled correctly? Memory leak risks from loading patterns?

**Assets.** Static assets (icons, splash, backgrounds) appropriately sized? Vector where raster would be wasteful, and vice versa? Asset loading blocking initial render?

---

## JavaScript thread

**Expensive sync operations.** Large array operations (`sort`, `filter`, `map`, `reduce`) on render paths? `JSON.parse`/`stringify` on large payloads in render paths? Complex computations not memoized? Synchronous storage reads blocking render (MMKV is fast enough; AsyncStorage in render is not)?

**Imports and bundle.** Large libraries imported entirely where specific exports would do (lodash, moment/date-fns, icon packs)? Duplicate deps doing the same job? Imports that could be lazy-loaded (screens, heavy modals)? Impact on startup?

**Effects and subscriptions.** `useEffect` deps causing effects to fire too frequently? Effects running on every render? Subscriptions cleaned up on unmount? Memory-leak patterns from uncleaned subscriptions?

---

## Startup performance

**Initial load.** Synchronous work on app startup? Blocking operations before the first screen renders? Splash / loading state during initialization? Critical path to first meaningful render?

**Screen load.** For each screen: data fetched on mount? Prefetched or on-demand? Waterfalls (A → B → C sequentially where parallel would work)? Skeleton or loading UI shown immediately?

**Navigation.** Screens pre-rendered or rendered on demand (`lazy` in nav config)? Expensive work in focus/blur handlers? Heavy computation on tab switches?

---

## Memory management

**Leak risks.** Subscriptions or listeners not cleaned up on unmount. Timers (`setTimeout`, `setInterval`) not cleared on unmount. Event listeners attached without corresponding removal. Large data structures held in state unnecessarily. Closures capturing large objects.

**State size.** Large data structures in state that could be derived or paginated? Unbounded lists in state (chat history, event log)? Remote data cached appropriately vs re-fetched vs held forever?

**Unmount cleanup.** All effects returning cleanup functions where needed? Async operations cancelled or guarded on unmount (avoid `setState` on unmounted components)?

---

## Network performance

**Requests.** Redundant API calls for the same data? Requests that could be batched but are made individually? Requests parallel where possible, or sequential? Polling patterns — frequency, necessity, cost?

**Caching.** Remote data cached between sessions? Within a session? Cache invalidation sensible? Optimistic updating in place where it would help UX?

**Errors and retry.** Failed requests retried? Retry logic appropriate (exponential backoff, max attempts)? Infinite retry loops possible?

---

## Styling and layout

**Style computation.** Styles computed on render or defined statically? Inline style objects created on every render? `StyleSheet.create()` used correctly? If a compiled styling lib (NativeWind, Unistyles, Tamagui) — compile-time or runtime? Coordinate with design-system subagent if the styling engine itself is a bottleneck.

**Layout thrashing.** Patterns causing multiple layout passes? `onLayout` handlers doing expensive work? Conditional renders causing significant layout shifts?

**Effects.** Heavy visual effects (shadows, blur, opacity animations) on large surfaces? Shadows on list items (extremely expensive on Android)? Overdraw from layered transparent views?

---

## Maturity scale

Report your section 1 assessment as exactly one of:

- **no consideration** — no memoization, `ScrollView.map()` for large lists, JS-thread animations, no image caching. Jank on entry.
- **ad-hoc** — some memoization where problems were noticed and fixed. No systemic patterns.
- **partial** — lists virtualized, animations on native driver where obvious, but hooks and context still leak re-renders.
- **deliberate** — memoization deliberate, list items lightweight, animations worklet-based, image strategy consistent. Occasional gaps.
- **optimized** — profiled, measured, and tuned. Perf budgets enforced. Regressions caught in review.

Do not soften. If half the lists are `ScrollView.map()`, that is no-consideration or ad-hoc, not partial.

---

## Category-specific "not a finding"

- Micro-optimizations without evidence of impact (memoizing a component that renders once at app start). Only flag when the render path is hot.
- "Should switch bundler / enable Hermes / turn on New Architecture" is not a finding unless the current setting has a concrete measured impact you can cite. Otherwise it is a suggestion for the roadmap, not an audit finding.
- Missing `React.memo` on a component whose parent rarely re-renders. Only flag when parent re-render frequency is real.
- Perf work that would land in a component the design-system subagent flags as slated for redesign. Note the coupling in `impact` and let the synthesis phase order it.