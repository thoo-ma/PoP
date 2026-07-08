# Architecture Playbook

You are auditing the structural shape of a React Native codebase. Your subagent scope is *architecture only* — not styling quality, not perf, not a11y. If you find yourself writing findings that belong in another category, stop and drop them; another subagent owns that ground.

Structure the "Detailed audit" section of your report using the subsection headers below. Do not renumber or rename them.

---

## Module and dependency map

**Inventory.** Every distinct module, package, or domain boundary. For each: name and location, responsibility, what it owns, what it depends on.

**Dependency graph.** Which modules are upstream vs downstream. Where the arrows point. Any circular dependencies. Any modules with many dependents (high coupling / high blast radius on change).

**Boundary assessment.** Where boundaries are enforced (barrel exports respected, deep imports rare). Where they leak (screen imports directly into another feature's internals, shared helpers reaching into UI). Where boundaries are missing entirely (a "utils" or "helpers" folder that everything imports from).

---

## State management

**Inventory.** Every distinct kind of state and where it lives: local component state, shared UI state, server/remote state, navigation state, persisted state (MMKV, AsyncStorage, secure store), derived state.

**Patterns.** What tools are in use (hooks, Context, Redux, Zustand, Jotai, TanStack Query, other). Whether they are applied consistently or ad-hoc. Whether there are competing patterns doing the same job (two state libs, or Context re-implementing what a query cache already does).

**Flow.** Top-down data flow — is it predictable? Side effects — where do they live, are they contained? Mutations — localized or spread across the codebase?

**Problems.** Prop drilling depth and spread. State duplication (same data in multiple places). Stale-state risk (places where sources can get out of sync). Over-fetching or under-fetching patterns.

---

## Component architecture

**Responsibilities.** For each component category (screen, feature, shared UI, primitive): one thing or many? Mixes UI + logic + data fetching? Right level of abstraction for its role?

**Composition patterns.** What patterns are in use (children, render props, compound components, slot patterns). Whether they are consistent. Where composition breaks down into prop explosion or deep nesting.

**Boundaries.** Where components should be split that currently are not. Where they are split too granularly. Where a component is doing work that belongs in a hook, a store, or a service.

**Reusability.** Which components are genuinely reusable vs accidentally coupled to a screen. What prevents non-reusable components from being reusable (imports from screens, hard-coded feature knowledge, business logic embedded). Missing abstractions — repeated patterns that should be components.

---

## Data layer

**Fetching.** What mechanisms are in use (fetch, axios, TanStack Query, RTK Query, other). Where API calls live (components, hooks, services, mixed). Whether fetching is separated from UI. Whether caching, deduplication, and retry are in place.

**Transformation.** Where remote data is reshaped into local form. Whether transformation is co-located with fetching or scattered. Whether type boundaries exist between wire and local shapes.

**Error handling.** How errors are handled. Whether handling is consistent across all data operations. Where errors fall through to unhandled rejections or empty UI.

**Contracts.** Are API response shapes typed? Where do types come from — generated (OpenAPI, GraphQL codegen), manual, inferred? Where is the contract implicit or missing?

---

## Navigation architecture

**Structure.** What library is in use (React Navigation, Expo Router, other). Screen hierarchy. How navigation state is managed and where it is inspected.

**Patterns.** How screens are navigated to and from. How data is passed between screens (params, shared state, context). Deep linking and URL patterns.

**Problems.** Over-coupled navigation (screens knowing too much about each other's params). Data passed through nav that should be in shared state. Nav logic inside components that belongs in a hook or a service layer.

---

## Cross-cutting concerns

**Error boundaries.** Where they are placed. Granularity. What falls outside their coverage (async errors, event handlers, Suspense fallbacks missing).

**Auth.** Where the logic lives. Whether it is separated from UI. How auth state propagates. Whether protected routes/screens are enforced structurally or by convention.

**Logging and observability.** What exists (Sentry, Bugsnag, custom, none). Whether logging is consistent or absent in critical paths (auth, payments, sync).

**Configuration.** How environment config is handled (env files, EAS profiles, runtime config). Hardcoded values that should be config.

---

## Code quality patterns

**Consistency.** Whether patterns are applied uniformly. Where the same problem is solved in different ways. What inconsistency reveals about how the codebase evolved (migrations left half-done, competing philosophies).

**Abstractions.** Which are well-designed and useful. Which are leaky, wrong-level, or over-engineered. Where abstractions are missing that would simplify the codebase.

**Debt.** Unused components, functions, modules. Commented-out code. TODO/FIXME clusters — what do they reveal about known problems? Quick fixes that created longer-term debt.

---

## Maturity scale

Report your section 1 assessment as exactly one of:

- **no structure** — files organized by accident. Any change ripples unpredictably.
- **ad-hoc** — some conventions exist but not enforced. Individual features work; the whole does not compose.
- **emerging** — clear conventions in newer code, older code has not caught up. Direction is set.
- **consistent** — conventions applied throughout. New work slots in predictably.
- **production-grade** — boundaries enforced structurally, state model deliberate, data flow clear. Ready for scale.

Do not soften. If the codebase is ad-hoc, say ad-hoc.

---

## Category-specific "not a finding"

- Any React Native project has some prop drilling. Only flag when depth ≥ 3 hops or when the same drilled value appears across many trees.
- Any codebase has some inconsistency. Only flag when the inconsistency creates confusion, bugs, or blocks the redesign.
- Structural preferences without concrete impact (feature-folder vs type-folder). Only flag when the current choice causes measurable friction.
- "Should use library X instead of Y" is not a finding unless Y is actively causing problems in this codebase.