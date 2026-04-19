import { tv } from 'tailwind-variants'

// ── Progress bar ──────────────────────────────────────────────────────────────
// Reusable track + fill bar used by NFTProperties (stat bars),
// NFTCard (XP bar), and BreedOutcomePanel (probability bars).
export const progressBar = tv({
  slots: {
    track: 'flex-1 bg-surface-container-highest rounded-full overflow-hidden',
    fill: 'h-full rounded-full',
  },
  variants: {
    size: {
      sm: { track: 'h-1' },
      md: { track: 'h-2' },
    },
  },
  defaultVariants: { size: 'md' },
})
