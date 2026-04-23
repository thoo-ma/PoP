import { tv } from 'tailwind-variants'

// TODO(redesign): if a third feedback frame appears, extract a shared
// feedbackContainer recipe. Today: lootPanel only.
// ── Loot roulette card ────────────────────────────────────────────────────────
// Layout slots for the LootRouletteCard component.
export const lootPanel = tv({
  slots: {
    wrapper: 'mx-4 border-tactile-sm border-border border-b-tactile-md rounded-frame',
    root: 'overflow-hidden rounded-body items-center gap-4',
    body: 'items-center gap-4 w-full',
    title: 'text-heading-xs font-bold',
    chanceValue: 'font-bold text-stat-luck',
    holdText: 'text-body-md italic text-stat-efficiency font-bold',
    maxHoldText: 'text-body-md italic text-stat-comfort font-bold',
    rollError: 'text-body-md text-center text-stat-energy font-bold',
    buttonRow: 'flex-row gap-3 w-full mt-2',
  },
})

// ── Loot result panel ─────────────────────────────────────────────────────────
// Won / lost outcome panel shown after a loot roll.
export const lootResultPanel = tv({
  slots: {
    root: 'items-center gap-2 rounded-frame py-4 px-6 w-full',
    title: 'text-center',
    body: 'text-body-base text-center',
  },
  variants: {
    status: {
      won: {
        root: 'bg-success-soft',
        title: 'text-heading-md font-extrabold text-success',
        body: 'text-success',
      },
      lost: {
        root: 'bg-surface-secondary',
        title: 'text-heading-xs font-bold text-foreground',
        body: 'text-muted font-bold',
      },
    },
  },
})
