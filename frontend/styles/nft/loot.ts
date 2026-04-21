import { tv } from 'tailwind-variants'

// ── Loot roulette card ────────────────────────────────────────────────────────
// Layout slots for the LootRouletteCard component.
export const lootCard = tv({
  slots: {
    wrapper: 'mx-4 border-tactile-sm border-outline border-b-tactile-md rounded-xl',
    root: 'overflow-hidden rounded-lg items-center gap-4',
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
    root: 'items-center gap-2 rounded-xl py-4 px-6 w-full',
    title: 'text-center',
    body: 'text-body-base text-center',
  },
  variants: {
    status: {
      won: {
        root: 'bg-app-success-container',
        title: 'text-heading-md font-extrabold text-app-success',
        body: 'text-app-success',
      },
      lost: {
        root: 'bg-surface-container-low',
        title: 'text-heading-xs font-bold text-on-surface',
        body: 'text-on-surface-variant font-bold',
      },
    },
  },
})
