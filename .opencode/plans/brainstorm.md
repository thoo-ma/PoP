# Implementation Plan: Design System Storybook

**Approach**: B — Story Files + Generic Renderer
**First component**: Button
**Status**: PLANNING — do not implement

---

## Architecture

```
ProfileScreen.tsx  (unchanged — `__DEV__` lazy requires DevCatalog + DevPreviewRenderer)
  └── DevCatalog.tsx  (add "Design System" section)
       └── onSelect('ds:button', sectionIndex)
  └── DevPreviewRenderer.tsx  (add `ds:*` dispatch at top of function)
       └── renderDesignSystem(key, dismiss)
            └── DesignSystemRenderer.tsx
                 ├── getStory(key) → lazy requires story files
                 └── Renders PreviewShell → ScrollView of groups/items
                      └── Button.stories.ts
                           └── imports Button from @/components/ui
```

We dispatch `ds:*` keys inside `renderDevPreview` so ProfileScreen needs zero changes.

---

## Files to Create

### 1. `frontend/components/dev/storyTypes.ts`

Type definitions for the story system:

```ts
import type { ReactNode } from 'react'

export interface StoryItem {
  /** Label displayed below the rendered component */
  label: string
  /** Render function that returns the component instance */
  render: () => ReactNode
}

export interface StoryGroup {
  /** Section heading shown above the item row */
  title: string
  /** Items rendered in a flex-wrap row */
  items: StoryItem[]
}

export interface ComponentStory {
  /** Display name of the component (used for navigation / search, future) */
  componentName: string
  /** Optional description shown at the top of the story page */
  description?: string
  /** Groups of variants displayed in labeled sections */
  groups: StoryGroup[]
}
```

**Pattern**: Pure types — no dependencies, no side effects.
**Size**: ~25 lines

---

### 2. `frontend/components/ui/Button.stories.ts`

Declarative story definition co-located with Button:

```ts
import { MaterialIcons } from '@expo/vector-icons'
import { Button } from '@/components/ui'
import type { ComponentStory } from '@/components/dev/storyTypes'

export const buttonStories: ComponentStory = {
  componentName: 'Button',
  description: 'Brand-baked button with tactile raise effect. 7 variants, 3 sizes.',
  groups: [
    {
      title: 'Variants',
      items: [
        { label: 'Primary', render: () => <Button variant="primary"><Button.Label>Primary</Button.Label></Button> },
        { label: 'Secondary', render: () => <Button variant="secondary"><Button.Label>Secondary</Button.Label></Button> },
        { label: 'Tertiary', render: () => <Button variant="tertiary"><Button.Label>Tertiary</Button.Label></Button> },
        { label: 'Outline', render: () => <Button variant="outline"><Button.Label>Outline</Button.Label></Button> },
        { label: 'Ghost', render: () => <Button variant="ghost"><Button.Label>Ghost</Button.Label></Button> },
        { label: 'Danger', render: () => <Button variant="danger"><Button.Label>Danger</Button.Label></Button> },
        { label: 'Danger Soft', render: () => <Button variant="danger-soft"><Button.Label>Danger Soft</Button.Label></Button> },
      ],
    },
    {
      title: 'Disabled',
      items: [
        { label: 'Primary', render: () => <Button variant="primary" isDisabled><Button.Label>Primary</Button.Label></Button> },
        { label: 'Secondary', render: () => <Button variant="secondary" isDisabled><Button.Label>Secondary</Button.Label></Button> },
        { label: 'Tertiary', render: () => <Button variant="tertiary" isDisabled><Button.Label>Tertiary</Button.Label></Button> },
        { label: 'Outline', render: () => <Button variant="outline" isDisabled><Button.Label>Outline</Button.Label></Button> },
        { label: 'Ghost', render: () => <Button variant="ghost" isDisabled><Button.Label>Ghost</Button.Label></Button> },
        { label: 'Danger', render: () => <Button variant="danger" isDisabled><Button.Label>Danger</Button.Label></Button> },
        { label: 'Danger Soft', render: () => <Button variant="danger-soft" isDisabled><Button.Label>Danger Soft</Button.Label></Button> },
      ],
    },
    {
      title: 'Sizes',
      items: [
        { label: 'Small', render: () => <Button variant="primary" size="sm"><Button.Label>Small</Button.Label></Button> },
        { label: 'Medium', render: () => <Button variant="primary" size="md"><Button.Label>Medium</Button.Label></Button> },
        { label: 'Large', render: () => <Button variant="primary" size="lg"><Button.Label>Large</Button.Label></Button> },
      ],
    },
    {
      title: 'With Icon',
      items: [
        { label: 'Leading icon', render: () => <Button variant="primary"><MaterialIcons name="add" size={18} color="white" /><Button.Label>Add Item</Button.Label></Button> },
        { label: 'Trailing icon', render: () => <Button variant="primary"><Button.Label>Next</Button.Label><MaterialIcons name="arrow-forward" size={18} color="white" /></Button> },
        { label: 'Icon only', render: () => <Button variant="primary" isIconOnly><MaterialIcons name="favorite" size={18} color="white" /></Button> },
      ],
    },
  ],
}
```

**Groups**: 4 curated groups, ~20 items total.
**Icons**: Uses `MaterialIcons` from `@expo/vector-icons` (already in the codebase, used by ProfileScreen).
**Pattern**: Named export (`buttonStories`), co-located with component.

---

### 3. `frontend/components/dev/DesignSystemRenderer.tsx`

Generic renderer that looks up a story by key and renders it:

```tsx
import type { ReactNode } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Button } from '@/components/ui'
import type { ComponentStory } from './storyTypes'

// ─── Lazy story registry ─────────────────────────────────────────────────────

function getStory(key: string): ComponentStory | null {
  switch (key) {
    case 'ds:button':
      return (require('@/components/ui/Button.stories') as { buttonStories: ComponentStory }).buttonStories
    default:
      return null
  }
}

// ─── Preview shell ──────────────────────────────────────────────────────────

function PreviewShell({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  return (
    <View className="flex-1">
      {children}
      <View className="absolute bottom-32 left-6 right-6">
        <Button variant="primary" onPress={onBack} className="w-full">
          <Button.Label>← Back to Catalog</Button.Label>
        </Button>
      </View>
    </View>
  )
}

// ─── Main renderer ──────────────────────────────────────────────────────────

export function renderDesignSystem(key: string, dismiss: () => void): ReactNode {
  const story = getStory(key)
  if (!story) {
    return (
      <PreviewShell onBack={dismiss}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground font-bold">Unknown component: {key}</Text>
        </View>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell onBack={dismiss}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="p-4 pb-52 gap-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        {story.description && (
          <Text className="text-sm text-muted text-center px-4">{story.description}</Text>
        )}

        {/* Groups */}
        {story.groups.map((group) => (
          <View key={group.title} className="gap-3">
            <Text className="text-xs font-black text-muted uppercase tracking-wider px-1">
              {group.title}
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {group.items.map((item) => (
                <View key={item.label} className="items-center gap-2">
                  {item.render()}
                  <Text className="text-xs text-muted text-center">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </PreviewShell>
  )
}
```

**Key design decisions**:
- `getStory()` uses `require()` inside a function body (not static import). Metro dead-strips this because `renderDesignSystem` is only called when `renderDevPreview` is loaded, which is behind `__DEV__`.
- PreviewShell is duplicated here (11 lines) rather than imported from DevPreviewRenderer, to avoid circular dependency.
- `pb-52` on content container ensures the back button doesn't cover content.
- Section titles match DevCatalog style: `text-xs font-black text-muted uppercase tracking-wider`.
- Items use `flex-row flex-wrap gap-3` — natural-width layout, no forced uniform sizing.
- Labels are `text-xs text-muted text-center` below each component.
- `bg-background` on ScrollView ensures dark/light theme support.

---

## Files to Modify

### 4. `frontend/components/dev/DevCatalog.tsx`

**Location**: Add a new section to the `CATALOG` array. Insert it before "Components" section (design system is conceptually related but distinct):

```tsx
// Inside CATALOG array (after "Auth" section, before "Shared"? 
// or better: at the end after "Components"):
{
  title: 'Design System',
  entries: [
    ['ds:button', 'Button'],
  ],
},
```

**Placement**: The sections are currently ordered: Profile, Auth, Shared, Breed, Repair, Poop, Vault, Marketplace, Components. I'll add "Design System" after "Components" (since it's a distinct concern).

**Lines changed**: ~5 (add one section with one entry)

---

### 5. `frontend/components/dev/DevPreviewRenderer.tsx`

**Location**: Add the `ds:*` dispatch at the top of the `renderDevPreview` function, before the existing `if (key === 'shared:screen-error')` chain.

```tsx
// After the existing imports, add:
import { renderDesignSystem } from './DesignSystemRenderer'

// At the top of the renderDevPreview function body, BEFORE any existing if-checks:
export default function renderDevPreview(key: string, dismiss: () => void): ReactNode {
  // ════════════════════════════════════════════════════════════════════════════
  // DESIGN SYSTEM
  // ════════════════════════════════════════════════════════════════════════════
  if (key.startsWith('ds:')) return renderDesignSystem(key, dismiss)

  // ... existing code unchanged
```

**Lines changed**: ~3 (1 import + 2 lines of dispatch)

---

## What Happens When You Tap "Button"

1. DevCatalog "Design System" section → tap "Button" → `onSelect('ds:button', sectionIndex)`
2. ProfileScreen: `setActivePreview('ds:button')` + `setActiveSectionIndex(n)`
3. ProfileScreen re-renders → `if (__DEV__ && activePreview && renderDevPreview)` → true
4. `renderDevPreview('ds:button', dismiss)` is called
5. `key.startsWith('ds:')` → `renderDesignSystem('ds:button', dismiss)` is called
6. `getStory('ds:button')` → lazy requires `Button.stories.ts` → returns story object
7. Renders PreviewShell with ScrollView containing 4 groups, ~20 buttons with labels

---

## Production Impact

Zero. The entire chain is behind `__DEV__` guards:
- `renderDevPreview` only loaded when `__DEV__` is true
- `renderDesignSystem` only imported when `renderDevPreview` is loaded
- `getStory()` lazy requires only invoked when a `ds:*` key is used
- Story files only loaded when `getStory()` is called
- All code dead-stripped by Metro minifier at production build

---

## Verified By

```bash
pnpm typecheck --filter=pop
```

No tests exist in this repo (per AGENTS.md). Typecheck is the only verification.

---

## Follow-Up Components

After Button is working, the same pattern extends trivially:

| Component | Stories file | Groups (examples) |
|---|---|---|
| Card | `ui/Card.stories.ts` | Plain cards, Cards with Header/Body/Footer, with Title/Description |
| Alert | `ui/Alert.stories.ts` | 6 status variants, with/without title, with/without children |
| Dialog | `ui/Dialog.stories.ts` | Open/closed states (render pre-opened) |
| Chip | `ui/Chip.stories.ts` | All colors, all variants, with/without icons |
| Spinner | `ui/Spinner.stories.ts` | Sizes, colors |
| Skeleton | `ui/Skeleton.stories.ts` | Various shapes (text, circle, rectangle) |

Each follow-up component requires only:
1. One new `ui/<Component>.stories.ts` file (~30-50 lines)
2. One new `case` in `getStory()` switch (~2 lines)
3. One new entry in DevCatalog `CATALOG` (~1 line)
