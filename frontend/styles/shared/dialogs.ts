import { tv } from 'tailwind-variants'

// ── Dialog body ─────────────────────────────────────────────────────────────
export const dialogBody = tv({
  base: 'mb-4 gap-1.5',
})

// ── Sign-out confirmation dialog ──────────────────────────────────────────────
// Declarative confirm dialog built in useSignOutDialog().
export const signOutDialog = tv({
  slots: {
    content: 'mx-6 rounded-3xl px-6 pt-6 pb-8 border-tactile-sm border-outline',
    buttonRow: 'flex-row gap-3',
  },
})

// ── Dialog footer row ─────────────────────────────────────────────────────────
// Right-aligned action row inside alert / confirm dialogs.
export const dialogFooter = tv({
  base: 'flex-row justify-end',
})
