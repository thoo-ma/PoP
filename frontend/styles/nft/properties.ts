import { tv } from 'tailwind-variants'

// ── Property bar ──────────────────────────────────────────────────────────────
// Stat bar row (label + track + value) used in NFTProperties.
// mode='compact'  → tight single-row layout (used in grid cards)
// mode='detailed' → stacked layout with larger bar (used in detail views)
export const propertyBar = tv({
  slots: {
    root: '',
    label: 'text-on-surface-variant',
    barWrap: 'flex-row items-center',
    value: 'text-right font-bold',
  },
  variants: {
    mode: {
      compact: {
        root: 'flex-row items-center justify-between',
        label: 'text-caption-sm w-[50px] mr-1',
        barWrap: 'flex-1 gap-1',
        value: 'text-caption-sm text-on-surface-variant w-5',
      },
      detailed: {
        root: 'gap-1',
        label: 'text-xs font-bold mb-0.5',
        barWrap: 'gap-1.5',
        value: 'text-xs text-on-surface font-bold w-[26px]',
      },
    },
  },
  defaultVariants: { mode: 'compact' },
})

// ── Properties wrapper ────────────────────────────────────────────────────────
// Outer container for the NFTProperties list.
export const propertiesWrapper = tv({
  base: 'mt-2',
  variants: {
    mode: {
      compact: 'gap-1',
      detailed: 'gap-2',
    },
  },
  defaultVariants: { mode: 'compact' },
})

// ── NFT picker placeholder ──────────────────────────────────────────────────────────
// Empty-state text inside the picker Button when no NFT is selected.
export const nftPickerPlaceholder = tv({
  slots: {
    icon: 'text-icon-xl mb-3 text-on-surface-variant',
    label: 'text-base font-bold text-on-surface-variant',
  },
})
