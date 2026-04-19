import { tv } from 'tailwind-variants'

// ── Page indicator (bottom nav bar) ──────────────────────────────────────────
export const pageIndicator = tv({
  slots: {
    wrapper: 'absolute bottom-10 left-0 right-0 flex-row justify-center items-center',
    rail: 'flex-row bg-surface rounded-3xl px-4 py-2.5 gap-1 border-[3px] border-outline border-b-[6px]',
    navButton: 'px-2.5 py-1',
    iconContainer: 'items-center',
    navLabel: 'text-caption mt-1',
  },
  variants: {
    active: {
      true: { navLabel: 'font-black' },
      false: { navLabel: 'font-bold' },
    },
  },
  defaultVariants: { active: false },
})

// ── NFT selector counter ───────────────────────────────────────────────────────────
// The "1 / 5" counter text shown between the prev / next arrows in NFTSelector.
export const nftSelectorCounter = tv({
  base: 'text-body-xl font-bold text-outline min-w-[60px] text-center',
})
