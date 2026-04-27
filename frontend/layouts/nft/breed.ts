import { tv } from 'tailwind-variants'

// ── Parent slot card ──────────────────────────────────────────────────────────
// Tappable NFT slot card used in the Breed screen (filled and empty states).
export const parentSlot = tv({
  slots: {
    root: 'flex-1 rounded-panel border-2 border-border overflow-hidden bg-surface',
    image: 'w-full aspect-square',
    info: 'p-2 pb-1',
    name: 'text-body-sm font-black text-foreground mb-1',
    // TODO(redesign): chip-row layouts have diverged across the app
    // (gap-1 no-wrap here vs gap-2 wrap in filterControls.tagList).
    // Reconcile before extracting a shared chipRow recipe.
    chipsRow: 'flex-row gap-1',
    hintSection: 'px-2 pb-2',
    hintText: 'text-body-sm text-muted italic font-bold',
    emptyRoot: 'aspect-square justify-center items-center bg-surface-secondary',
    // half-step: visual centering of the icon vs label below; whole-step
    // (mb-2) leaves the icon floating.
    emptyIcon: 'text-icon-lg text-default-300 mb-1.5',
    emptyLabel: 'text-body-md text-muted text-center px-4 leading-4 font-bold',
  },
  variants: {
    empty: {
      true: { root: 'border-dashed border-2 rounded-card' },
    },
  },
})

// ── Breed outcome panel ─────────────────────────────────────────────────────
// Read-only probability breakdown card shown after both parents are selected.
export const breedOutcomePanel = tv({
  slots: {
    wrapper: 'w-full mb-5 border-2 border-border rounded-frame',
    root: 'overflow-hidden rounded-body',
    // half-step: tighter row rhythm for the dense probability grid; py-2
    // makes the panel feel airy and inconsistent with the row spacing.
    body: 'px-4 py-1.5',
    title: 'text-body-sm font-bold uppercase tracking-widest mb-2',
    row: 'flex-row items-center mb-1 gap-2',
    label: 'text-body-sm text-foreground font-bold w-label-lg',
    value: 'text-body-md font-bold text-foreground w-11 text-right',
  },
})

// ── Parent slots row ──────────────────────────────────────────────────────────
// Row container with two parent slot cards and a multiply separator.
export const parentSlotsRow = tv({
  slots: {
    root: 'flex-row items-stretch justify-center mb-6 w-full',
    separator: 'w-9 justify-center items-center',
    separatorText: 'text-heading-md font-bold text-foreground',
  },
})

// ── Breed result section ──────────────────────────────────────────────────────
// Layout for the success state shown after a breed completes.
export const breedResultPanel = tv({
  slots: {
    root: 'items-center w-full',
    title: 'text-heading-md font-black text-foreground mb-5 text-center',
    parentsRow: 'flex-row items-center mb-5 gap-2',
    parentImage: 'size-thumbnail rounded-body border border-border',
    multiplyText: 'text-heading-xs text-muted font-bold',
    arrowText: 'text-heading-sm text-foreground font-bold',
  },
})

// ── Cost strikethrough ────────────────────────────────────────────────────────
// Inline strikethrough text for the original cost inside action button labels.
export const costStrikethrough = tv({
  base: 'line-through text-muted font-bold',
})
