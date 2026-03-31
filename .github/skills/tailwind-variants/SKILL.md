---
name: tailwind-variants
description: "Tailwind-variants (tv) style extraction for React Native. Use when centralising className strings into reusable tv() recipes, creating wrapper components with variant props, or factoring out duplicated Tailwind classes across components. Keywords: tailwind-variants, tv(), variants, compoundVariants, slots, className extraction, style recipes, cn, tailwind-merge."
user-invocable: true
metadata:
  author: PoP team
  version: "1.0.0"
---

# Tailwind-Variants Style Extraction Guide

Use `tailwind-variants` (`tv()`) to centralise and deduplicate className strings across React Native components. This skill covers **when** to use tv(), **how** to structure recipes, and the **conventions** adopted in this project.

---

## Prerequisites

These packages must already be installed (they are in this project):

```json
{
  "tailwind-variants": "^3.2.2",
  "tailwind-merge": "^3.5.0",
  "heroui-native": "^1.0.0-rc.4"
}
```

`heroui-native` re-exports `cn` (a `clsx` + `tailwind-merge` wrapper). No separate `clsx` install is needed:

```tsx
import { cn } from 'heroui-native';
```

---

## When To Use tv()

| Situation | Use tv()? | Why |
|---|---|---|
| A className string appears 3+ times across files | **Yes** | Eliminates duplication, single source of truth |
| A component has visual variants (size, color, status) | **Yes** | Variants are the primary use-case for tv() |
| A multi-element pattern repeats (e.g. card with header + body + footer) | **Yes, with slots** | Slots keep related styles grouped |
| A className is used once and is short | **No** | Inline is fine — no abstraction needed |
| A className is composed with dynamic JS values (e.g. `style={{ backgroundColor: runtimeColor }}`) | **No for the dynamic part** | tv() requires static strings; keep `style={{}}` for runtime values |
| You need to merge external className props with internal defaults | **Use cn()** | cn() deduplicates conflicting Tailwind utilities |

---

## Core API

### Simple recipe (single element)

```tsx
import { tv } from 'tailwind-variants';

export const screenTitle = tv({
  base: 'text-[32px] font-bold text-center',
  variants: {
    spacing: {
      sm: 'mb-2',
      md: 'mb-3',
    },
    color: {
      accent: 'text-text-title',
      neutral: 'text-gray-700',
      default: 'text-foreground',
    },
  },
  defaultVariants: { spacing: 'md', color: 'accent' },
});

// Usage:
<Text className={screenTitle()}>Vault</Text>               // defaults
<Text className={screenTitle({ color: 'neutral' })}>Poop</Text>  // override
```

### Slot recipe (multi-element)

Use when a **group of elements** forms a single visual unit:

```tsx
export const challengeHeader = tv({
  slots: {
    root: 'flex-row items-center w-full bg-white rounded-[14px] p-3 border border-gray-200 gap-3 shadow-sm',
    avatar: 'w-14 h-14 rounded-[10px] bg-gray-100',
    info: 'flex-1',
    name: 'text-[15px] font-bold text-gray-700 mb-0.5',
    subtitle: 'text-xs text-gray-500',
  },
});

// Usage:
const styles = challengeHeader();
<View className={styles.root()}>
  <Image className={styles.avatar()} ... />
  <View className={styles.info()}>
    <Text className={styles.name()}>...</Text>
    <Text className={styles.subtitle()}>...</Text>
  </View>
</View>
```

### Compound variants

Use when specific variant **combinations** need special treatment:

```tsx
export const resultCard = tv({
  slots: {
    root: 'w-full rounded-2xl p-6 border-2 items-center gap-1.5',
    title: 'text-[22px] font-bold text-gray-700 text-center',
    detail: 'text-sm text-gray-500 text-center',
  },
  variants: {
    status: {
      success: { root: 'bg-green-100 border-green-500' },
      failure: { root: 'bg-red-100 border-red-500' },
      warning: { root: 'bg-amber-100 border-amber-400' },
    },
  },
});
```

### Composing tv() output with cn()

When you need to merge a tv() recipe with **additional runtime classes** or an **external className prop**, always use `cn()`:

```tsx
import { cn } from 'heroui-native';

// Merging with an external prop
<View className={cn(phaseContainer(), props.className)} />

// Merging with a conditional class
<Text className={cn(timerText({ status: 'normal' }), isActive && 'opacity-100')} />
```

**Never** use template literals to concatenate tv() output:

```tsx
// WRONG — breaks tailwind-merge deduplication
<View className={`${phaseContainer()} mt-4`} />

// CORRECT
<View className={cn(phaseContainer(), 'mt-4')} />
```

---

## Project Conventions

### File structure

All tv() recipes live under `frontend/styles/`, organised by domain:

```
frontend/styles/
├── index.ts          # barrel export
├── layout.ts         # screen containers, scroll wrappers, grids
├── typography.ts     # titles, subtitles, labels, badge text
├── cards.ts          # card wrappers, image containers, badge positions
├── feedback.ts       # result/status cards, empty states
└── game.ts           # Poop-screen game phases, timer, recording
```

Every recipe is **named-exported** from its domain file and **re-exported** from `index.ts`:

```tsx
// frontend/styles/index.ts
export * from './layout';
export * from './typography';
export * from './cards';
export * from './feedback';
export * from './game';
```

Import from the barrel:

```tsx
import { screenTitle, resultCard, phaseContainer } from '@/styles';
```

### Naming

- **Recipe name** = camelCase noun describing the visual element: `screenTitle`, `resultCard`, `badgePosition`
- **Variant names** = short, semantic keys: `status`, `size`, `color`, `spacing`, `layout`
- **Variant values** = descriptive but terse: `sm`, `md`, `lg`, `primary`, `danger`, `success`
- **Slot names** = element role: `root`, `label`, `title`, `detail`, `avatar`, `info`

### When to create a new recipe vs extend an existing one

- **New recipe** when: the visual pattern is fundamentally different (different base classes, different slots)
- **New variant** when: the same structure renders differently based on state (e.g. success/failure/warning)
- **Extend with cn()** when: a one-off deviation from the recipe (e.g. extra margin on one specific usage)

### Granularity

- Don't create a tv() recipe for a single className that appears once (`"mt-4"`)
- Don't create a variant for every possible Tailwind utility — only for **meaningful visual states** that appear in the UI
- Prefer slots when 3+ elements always appear together as a unit

---

## Anti-Patterns

### Over-abstraction

```tsx
// BAD — unnecessary variant for something that appears once
const container = tv({
  variants: {
    paddingTop: {
      '60': 'pt-[60px]',
      '80': 'pt-[80px]',
      '100': 'pt-[100px]',
    },
  },
});

// GOOD — just use cn() for the one-off difference
<View className={cn(screenContainer(), 'pt-[80px]')} />
```

### Dynamic class construction

```tsx
// BAD — Tailwind can't see this at build time
const color = 'green';
<View className={resultCard({ status: color as any })} />

// GOOD — use a mapping to static variant names
const statusMap = { detected: 'success', notDetected: 'failure' } as const;
<View className={resultCard({ status: statusMap[result] })} />
```

### Skipping cn() when merging

```tsx
// BAD — template literal breaks deduplication
<View className={`${infoCard()} p-8`} />  // if infoCard has p-5, both apply

// GOOD — cn() deduplicates
<View className={cn(infoCard(), 'p-8')} />  // p-8 wins
```

### Putting runtime-computed values in tv()

```tsx
// BAD — tv() only works with static strings
export const badge = tv({
  variants: {
    color: {
      // This can't accept arbitrary hex values
      custom: '', // ???
    },
  },
});

// GOOD — keep dynamic styles in style={{}}
<View
  className={badgePosition({ position: 'topLeft' })}
  style={{ backgroundColor: RARITY_COLORS[nft.rarity] }}
/>
```

---

## Integration With HeroUI Native

HeroUI Native components **already use tv() internally**. When styling HeroUI components:

1. **Use the component's own props** (variant, size, color) for standard variants
2. **Use className** for additional Tailwind utilities
3. **Use cn()** when merging component classNames output with extra classes
4. **Create wrapper components** with tv() when you need project-specific variants on top of HeroUI

HeroUI also exports `classNames` objects for each component (e.g. `buttonClassNames`, `cardClassNames`). These can be applied to non-HeroUI elements to match the component's appearance:

```tsx
import { buttonClassNames, cn } from 'heroui-native';

<Pressable className={cn(buttonClassNames.root({ variant: 'primary', size: 'md' }), 'custom-class')}>
  <Text className={buttonClassNames.label({ variant: 'primary', size: 'md' })}>Link</Text>
</Pressable>
```

---

## Checklist For Adding a New Recipe

1. **Is it duplicated?** — Does this className (or close variant) appear in 2+ files?
2. **Pick the domain file** — `layout.ts`, `typography.ts`, `cards.ts`, `feedback.ts`, `game.ts`, or create a new one if no existing domain fits
3. **Define base** — Extract the common classes shared by all usages
4. **Identify variants** — What changes between usages? Those become variant keys
5. **Identify slots** — Are there multiple elements that always appear together? Use slots
6. **Default variants** — Set sensible defaults so the most common usage is just `recipe()`
7. **Export** — Named export from domain file + re-export from `index.ts`
8. **Replace usages** — Import from `@/styles` and replace inline classNames
9. **Use cn()** — When merging with external className props or one-off overrides
10. **Verify** — `pnpm exec turbo run typecheck --filter=pop` must pass with zero errors

---

## Reference

- [tailwind-variants docs](https://tailwind-variants.org/) — full API reference
- [HeroUI Native styling guide](https://v3.heroui.com/docs/native/getting-started/styling) — official HeroUI + tv() patterns
- Uniwind SKILL.md — `tv()` section (line 647+) and `cn()` utility (line 700+)
- `frontend/styles/game.ts` — first recipe file created in this project, good example of slot patterns
