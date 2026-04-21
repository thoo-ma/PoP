import { tv } from 'tailwind-variants'

// ── AlertFrame ───────────────────────────────────────────────────────────────────
// Tactile alert surface wrapping HeroUI Native's Alert. Slots mirror the Alert
// composition: root carries the tactile border, title/description set weight.
export const alertFrame = tv({
  slots: {
    root: 'w-full rounded-2xl border-tactile-sm border-outline border-b-tactile-md',
    title: 'font-black',
    description: 'font-bold',
  },
})
