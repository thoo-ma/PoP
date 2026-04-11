import { tv } from 'tailwind-variants'

// ── Profile modal ─────────────────────────────────────────────────────────────
export const profileModal = tv({
  slots: {
    avatarWrap: 'mt-4 mb-4',
    title: 'text-3xl font-bold text-on-surface mb-2',
    username: 'text-lg font-semibold text-on-surface mb-1',
    email: 'text-base text-on-surface-variant mb-6',
    statsRow:
      'flex-row justify-around items-center w-full py-5 mb-6 bg-surface-container-low rounded-xl',
    statCol: 'flex-1 items-center',
    statValue: 'text-xl font-bold text-on-surface',
    statLabel: 'text-sm text-on-surface-variant',
    statDivider: 'w-px h-8 bg-border',
  },
})

// ── Wallet modal ──────────────────────────────────────────────────────────────
export const walletModal = tv({
  slots: {
    emoji: 'text-4xl mb-2',
    title: 'text-3xl font-bold text-on-surface mb-4',
    currencyLabel: 'text-lg text-on-surface-variant font-medium',
    inlineBold: 'font-bold text-on-surface',
    balanceCard: 'w-full bg-surface-container-low rounded-xl px-4 py-4 items-center mb-4',
    balanceLabel: 'text-sm text-on-surface-variant mb-1',
    balanceValue: 'text-3xl font-bold text-on-surface',
    infoSection: 'mb-4',
    infoSectionTitle: 'text-base font-bold text-on-surface mb-2',
    infoRow: 'flex-row items-start gap-2',
    infoText: 'flex-1 text-sm text-on-surface-variant leading-5',
  },
})
