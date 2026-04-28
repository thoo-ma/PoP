import { tv } from '@/lib/tv'

// ── AlertFrame ───────────────────────────────────────────────────────────────────
// Tactile alert surface wrapping HeroUI Native's Alert. Slots mirror the Alert
// composition: root carries the tactile border, title/description set weight.
export const alertFrame = tv({
  slots: {
    root: 'w-full rounded-card border-2 border-border border-b-raise',
    title: 'font-black',
    description: 'font-bold',
  },
})
