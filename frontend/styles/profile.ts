import { tv } from 'tailwind-variants'

// ── Profile modal ─────────────────────────────────────────────────────────────
export const profileModal = tv({
  slots: {
    scrollContainer: 'flex-grow items-center justify-center px-6 pb-10 pt-4',
    avatarWrap: 'mt-4 mb-4 rounded-full border-[3px] border-outline overflow-hidden',
    title: 'text-3xl font-black text-on-surface mb-2',
    username: 'text-lg font-bold text-on-surface mb-1',
    email: 'text-base text-on-surface-variant mb-6 font-bold',
    statsRow:
      'flex-row justify-around items-center w-full py-5 mb-6 bg-surface-container-low rounded-2xl border-[3px] border-outline',
    statCol: 'flex-1 items-center',
    statValue: 'text-xl font-bold text-on-surface',
    statLabel: 'text-sm text-on-surface-variant font-bold',
    statDivider: 'w-px h-8 bg-outline',
  },
})

// ── Wallet modal ──────────────────────────────────────────────────────────────
export const walletModal = tv({
  slots: {
    emoji: 'text-4xl mb-2',
    title: 'text-3xl font-black text-on-surface mb-4',
    currencyLabel: 'text-lg text-on-surface-variant font-bold',
    inlineBold: 'font-bold text-on-surface',
    balanceCard:
      'w-full bg-surface-container-low rounded-2xl px-4 py-4 items-center mb-4 border-[3px] border-outline',
    balanceLabel: 'text-sm text-on-surface-variant mb-1 font-bold',
    balanceValue: 'text-3xl font-bold text-on-surface',
    infoSection: 'mb-4',
    infoSectionTitle: 'text-base font-black text-on-surface mb-2',
    infoRow: 'flex-row items-start gap-2',
    infoText: 'flex-1 text-sm text-on-surface-variant leading-5',
  },
})
