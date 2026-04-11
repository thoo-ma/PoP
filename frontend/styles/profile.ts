import { tv } from 'tailwind-variants'

// ── Profile modal ─────────────────────────────────────────────────────────────
export const profileModal = tv({
  slots: {
    avatarWrap: 'mt-4 mb-4',
    title: 'text-3xl font-bold text-foreground mb-2',
    username: 'text-lg font-semibold text-foreground mb-1',
    email: 'text-base text-muted mb-6',
    statsRow: 'flex-row justify-around items-center w-full py-5 mb-6 bg-default rounded-xl',
    statCol: 'flex-1 items-center',
    statValue: 'text-xl font-bold text-foreground',
    statLabel: 'text-sm text-muted',
    statDivider: 'w-px h-8 bg-border',
  },
})

// ── Wallet modal ──────────────────────────────────────────────────────────────
export const walletModal = tv({
  slots: {
    emoji: 'text-4xl mb-2',
    title: 'text-3xl font-bold text-foreground mb-4',
    currencyLabel: 'text-lg text-muted font-medium',
    inlineBold: 'font-bold text-foreground',
    balanceCard: 'w-full bg-default rounded-xl px-4 py-4 items-center mb-4',
    balanceLabel: 'text-sm text-muted mb-1',
    balanceValue: 'text-3xl font-bold text-foreground',
    infoSection: 'mb-4',
    infoSectionTitle: 'text-base font-bold text-foreground mb-2',
    infoRow: 'flex-row items-start gap-2',
    infoText: 'flex-1 text-sm text-muted leading-5',
  },
})
