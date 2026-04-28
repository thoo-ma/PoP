import { tv } from '@/lib/tv'

// ── Property bar ──────────────────────────────────────────────────────────────
// Stat bar row (label + track + value) used in NFTProperties.
// mode='compact'  → tight single-row layout (used in grid cards)
// mode='detailed' → stacked layout with larger bar (used in detail views)
export const propertyBar = tv({
  slots: {
    root: '',
    label: 'text-muted font-bold',
    barWrap: 'flex-row items-center',
    value: 'text-right font-bold',
  },
  variants: {
    mode: {
      compact: {
        root: 'flex-row items-center justify-between',
        label: 'text-caption-sm w-label-md mr-1',
        barWrap: 'flex-1 gap-1',
        value: 'text-caption-sm text-muted w-5 font-bold',
      },
      detailed: {
        root: 'gap-1',
        // half-step: tight label-above-bar pairing in the detailed property
        // bar; whole-step breaks the visual grouping.
        label: 'text-body-sm font-bold mb-0.5',
        // half-step: matches the label-above-bar rhythm.
        barWrap: 'gap-1.5',
        value: 'text-body-sm text-foreground font-bold w-label-sm',
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
export const nftPickerSlot = tv({
  slots: {
    icon: 'text-icon-xl mb-3 text-muted',
    label: 'text-body-base font-bold text-muted',
  },
})
