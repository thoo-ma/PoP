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

// ── Tactile tabs ─────────────────────────────────────────────────────────────
// Shared tactile-styled tab bar used by Vault and Marketplace.
export const tactileTabs = tv({
  slots: {
    list: 'self-center bg-surface border-[3px] border-outline border-b-[6px] rounded-full px-1 py-1',
    indicator: 'bg-surface-container-low border-2 border-outline rounded-full',
  },
})

// ── Screen header ────────────────────────────────────────────────────────────
// Floating screen title overlay positioned at the top of the screen.
export const screenHeader = tv({
  base: 'absolute top-screen-top-sm left-0 right-0 z-[99] h-12 items-center justify-center pointer-events-none',
})

// ── NFT selector counter ───────────────────────────────────────────────────────────
// The "1 / 5" counter text shown between the prev / next arrows in NFTSelector.
export const nftSelectorCounter = tv({
  base: 'text-body-xl font-bold text-outline min-w-[60px] text-center',
})
