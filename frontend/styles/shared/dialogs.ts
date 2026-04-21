import { tv } from 'tailwind-variants'

// ── Dialog body ─────────────────────────────────────────────────────────────
export const dialogBody = tv({
  base: 'mb-4 gap-1.5',
})

// ── Dialog footer row ─────────────────────────────────────────────────────────
// Right-aligned action row inside alert / confirm dialogs.
export const dialogFooter = tv({
  base: 'flex-row justify-end',
})
