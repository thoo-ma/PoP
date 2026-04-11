import { tv } from 'tailwind-variants'

// ── Floating nav button ───────────────────────────────────────────────────────
// Shared recipe for ProfileButton and WalletButton.
export const floatingNavButton = tv({
  base: 'absolute top-[60px] z-[100] p-2 bg-surface-overlay rounded-[20px] shadow-md',
  variants: {
    side: {
      left: 'left-5',
      right: 'right-5',
    },
  },
})

// ── Page indicator (bottom nav bar) ──────────────────────────────────────────
export const pageIndicator = tv({
  slots: {
    wrapper: 'absolute bottom-10 left-0 right-0 flex-row justify-center items-center',
    rail: 'flex-row bg-surface-overlay-rail rounded-[24px] px-4 py-[10px] gap-1 shadow-md',
    navButton: 'px-[10px] py-1',
    iconContainer: 'items-center',
    navLabel: 'text-[10px] mt-1',
  },
  variants: {
    active: {
      true: { navLabel: 'font-bold' },
      false: { navLabel: 'font-medium' },
    },
  },
  defaultVariants: { active: false },
})

// ── Screen header wrapper ─────────────────────────────────────────────────────
export const screenHeader = tv({
  base: 'absolute top-[60px] left-0 right-0 z-[99] h-12 items-center justify-center pointer-events-none',
})
// ── NFT selector counter ───────────────────────────────────────────────────────────
// The "1 / 5" counter text shown between the prev / next arrows in NFTSelector.
export const nftSelectorCounter = tv({
  base: 'text-[17px] font-bold text-outline min-w-[60px] text-center',
})
