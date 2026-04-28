import { tv } from '@/lib/tv'

// ── Dialog body ─────────────────────────────────────────────────────────────
export const dialogBody = tv({
  base: 'mb-4 gap-2',
})

// ── Dialog footer row ─────────────────────────────────────────────────────────
// Right-aligned action row inside alert / confirm dialogs.
export const dialogFooter = tv({
  base: 'flex-row justify-end',
})
