import { tv } from 'tailwind-variants'

// ── Screen loader ─────────────────────────────────────────────────────────────
// Full-screen centered spinner shown while data loads.
export const screenLoader = tv({
  slots: {
    root: 'flex-1 bg-background items-center justify-center',
    title: 'mt-4 text-headline-sm text-on-surface font-bold',
    message: 'mt-2 text-body-md text-on-surface-variant font-bold',
  },
})

// ── Screen error ───────────────────────────────────────────────────────────────
// Full-screen centered error alert.
export const screenError = tv({
  base: 'flex-1 bg-background items-center justify-center px-6',
})
