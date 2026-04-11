import { tv } from 'tailwind-variants'

// ── Parent slot card ──────────────────────────────────────────────────────────
// Tappable NFT slot card used in the Breed screen (filled and empty states).
export const parentSlot = tv({
  slots: {
    root: 'flex-1 rounded-[14px] border-2 overflow-hidden bg-content1 shadow-sm',
    image: 'w-full aspect-square',
    info: 'p-2 pb-1',
    name: 'text-[13px] font-bold text-foreground mb-1',
    chipsRow: 'flex-row gap-1',
    hintSection: 'px-2 pb-2',
    hintText: 'text-xs text-default-400 italic',
    emptyRoot: 'aspect-square justify-center items-center bg-default-100',
    emptyIcon: 'text-[36px] text-default-300 mb-1.5',
    emptyLabel: 'text-sm text-default-500 text-center px-4 leading-4',
  },
})

// ── Outcome panel ─────────────────────────────────────────────────────────────
// Read-only probability breakdown card shown after both parents are selected.
export const outcomePanel = tv({
  slots: {
    root: 'w-full mb-5',
    body: 'p-4',
    title: 'text-[13px] font-bold uppercase tracking-widest mb-3',
    row: 'flex-row items-center mb-2 gap-2',
    dot: 'w-2.5 h-2.5 rounded-full',
    label: 'text-[13px] text-foreground font-semibold w-[90px]',
    track: 'flex-1 h-2 bg-default-100 rounded overflow-hidden',
    fill: 'h-full rounded',
    value: 'text-sm font-bold text-default-600 w-11 text-right',
  },
})

// ── Parent slots row ──────────────────────────────────────────────────────────
// Row container with two parent slot cards and a multiply separator.
export const parentSlotsRow = tv({
  slots: {
    root: 'flex-row items-stretch justify-center mb-6 w-full',
    separator: 'w-[36px] justify-center items-center',
    separatorText: 'text-[26px] font-bold text-foreground',
  },
})

// ── Breed result section ──────────────────────────────────────────────────────
// Layout for the success state shown after a breed completes.
export const breedResultSection = tv({
  slots: {
    root: 'items-center w-full',
    title: 'text-[26px] font-bold text-foreground mb-5 text-center',
    parentsRow: 'flex-row items-center mb-5 gap-2',
    parentImage: 'w-[52px] h-[52px] rounded-lg border border-border',
    multiplyText: 'text-lg text-muted font-semibold',
    arrowText: 'text-[22px] text-foreground font-bold',
  },
})

// ── Breed cost strikethrough ──────────────────────────────────────────────────
// Inline strikethrough text for the original cost inside the Breed button label.
export const breedCostStrikethrough = tv({
  base: 'line-through text-foreground-500',
})
// ── Breed info text ───────────────────────────────────────────────────────────────
// Informational text shown inside info-box containers in the Breed screen.
// 'base' → minimum-NFT notice; 'hint' → smaller parents-not-yet-selected hint.
export const breedInfoText = tv({
  base: 'text-center',
  variants: {
    size: {
      base: 'text-sm text-foreground-500',
      hint: 'text-[13px] text-muted leading-5',
    },
  },
  defaultVariants: { size: 'base' },
})
