import { tv } from 'tailwind-variants'

// ── Profile modal ─────────────────────────────────────────────────────────────
export const profileModal = tv({
  slots: {
    scrollContainer: 'flex-grow items-center justify-center px-6 pb-32 pt-4',
    avatarWrap: 'mt-4 mb-4 rounded-full border-tactile-sm border-outline overflow-hidden',
    username: 'text-heading-xs font-bold text-on-surface mb-1',
    email: 'text-body-base text-on-surface-variant mb-6 font-bold',
    statsRow:
      'flex-row justify-around items-center w-full py-5 mb-6 bg-surface-container-low rounded-card border-tactile-sm border-outline',
    statCol: 'flex-1 items-center',
    statValue: 'text-heading-xs font-bold text-on-surface',
    statLabel: 'text-body-md text-on-surface-variant font-bold',
    statDivider: 'w-px h-8 bg-outline',
  },
})

// ── Wallet modal ──────────────────────────────────────────────────────────────
export const walletModal = tv({
  slots: {
    currencyLabel: 'text-heading-xs text-on-surface-variant font-bold',
    balanceCard:
      'w-full bg-surface-container-low rounded-card px-4 py-4 items-center mb-4 border-tactile-sm border-outline',
    balanceLabel: 'text-body-md text-on-surface-variant mb-1 font-bold',
    balanceValue: 'text-heading-lg font-bold text-on-surface',
  },
})
