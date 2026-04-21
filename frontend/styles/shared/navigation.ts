import { tv } from 'tailwind-variants'

// ── Page indicator (bottom nav bar) ──────────────────────────────────────────
export const pageIndicator = tv({
  slots: {
    wrapper: 'absolute bottom-10 left-0 right-0 flex-row justify-center items-center',
    // half-step: pill height for the floating bottom nav rail; py-2 reads
    // as a button bar, py-3 dominates the screen.
    rail: 'flex-row bg-surface rounded-modal px-4 py-2.5 gap-1 border-tactile-sm border-outline border-b-tactile-lg',
    // half-step: keeps the touch target wider than tall to fit five icons.
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
    list: 'self-center bg-surface border-tactile-sm border-outline border-b-tactile-lg rounded-full px-1 py-1 active:translate-y-[1px]',
    indicator: 'bg-surface-container-low border-2 border-outline rounded-full',
  },
})

// ── Screen header ────────────────────────────────────────────────────────────
// Floating screen title overlay positioned at the top of the screen.
export const screenHeader = tv({
  base: 'absolute top-screen-top-sm left-0 right-0 z-header h-12 items-center justify-center pointer-events-none',
})

// ── NFT selector counter ───────────────────────────────────────────────────────────
// The "1 / 5" counter text shown between the prev / next arrows in NFTSelector.
export const nftSelectorCounter = tv({
  base: 'text-body-xl font-bold text-on-surface-variant min-w-counter-min text-center',
})
