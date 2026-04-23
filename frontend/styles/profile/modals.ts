import { tv } from 'tailwind-variants'

// Layout-only recipes for the Profile screen. Color, background, and
// border-color utilities live inline on the JSX (or come from `<Card>` from
// `@/components/ui`) per the design-system three-layer separation.

// ── Profile section ───────────────────────────────────────────────────────────
export const profileModal = tv({
  slots: {
    scrollContainer: 'flex-grow items-center justify-center px-6 pb-32 pt-4',
    avatarWrap: 'mt-4 mb-4 rounded-full border-hairline overflow-hidden',
    username: 'text-heading-xs font-bold mb-1',
    email: 'text-body-base mb-6 font-bold',
    statsRow: 'flex-row justify-around items-center w-full py-5 mb-6',
    statCol: 'flex-1 items-center',
    statValue: 'text-heading-xs font-bold',
    statLabel: 'text-body-md font-bold',
    statDivider: 'w-px h-8',
  },
})

// ── Wallet section ────────────────────────────────────────────────────────────
export const walletModal = tv({
  slots: {
    currencyLabel: 'text-heading-xs font-bold',
    balanceCard: 'w-full px-4 py-4 items-center mb-4',
    balanceLabel: 'text-body-md mb-1 font-bold',
    balanceValue: 'text-heading-lg font-bold',
  },
})
