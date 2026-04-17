import { tv } from 'tailwind-variants'

// ── Screen loader ─────────────────────────────────────────────────────────────
// Full-screen centered spinner shown while data loads.
export const screenLoader = tv({
  slots: {
    root: 'flex-1 bg-background items-center justify-center',
    message: 'mt-3 text-sm text-on-surface-variant font-bold',
  },
})

// ── Screen error ───────────────────────────────────────────────────────────────
// Full-screen centered error alert.
export const screenError = tv({
  base: 'flex-1 bg-background items-center justify-center px-6',
})

// ── Screen info ────────────────────────────────────────────────────────────
// Full-screen centered informational alert.
export const screenInfo = tv({
  base: 'flex-1 bg-background items-center justify-center px-6',
})
