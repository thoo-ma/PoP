import { tv } from 'tailwind-variants'

// ── Empty state ────────────────────────────────────────────────────────────────
// Shared empty-state pattern for absent data across screens.
// layout="inline"  — compact, used inside a scroll container or list.
// layout="screen"  — full-screen centred, used as a standalone screen guard.
export const emptyState = tv({
  slots: {
    root: 'items-center px-6',
    icon: 'mb-3',
    title: 'text-body-base font-black text-foreground text-center',
    description: 'text-body-md font-bold text-muted text-center mt-1',
    action: 'mt-4 w-full',
  },
  variants: {
    layout: {
      inline: { root: 'py-16 w-full' },
      screen: { root: 'flex-1 bg-background justify-center' },
    },
  },
  defaultVariants: {
    layout: 'inline',
  },
})
