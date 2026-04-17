import { tv } from 'tailwind-variants'

// ── Parent slot card ──────────────────────────────────────────────────────────
// Tappable NFT slot card used in the Breed screen (filled and empty states).
export const parentSlot = tv({
  slots: {
    root: 'flex-1 rounded-[14px] border-[3px] border-outline overflow-hidden bg-surface',
    image: 'w-full aspect-square',
    info: 'p-2 pb-1',
    name: 'text-[13px] font-black text-on-surface mb-1',
    chipsRow: 'flex-row gap-1',
    hintSection: 'px-2 pb-2',
    hintText: 'text-xs text-on-surface-variant italic font-bold',
    emptyRoot: 'aspect-square justify-center items-center bg-surface-container-low',
    emptyIcon: 'text-[36px] text-default-300 mb-1.5',
    emptyLabel: 'text-sm text-on-surface-variant text-center px-4 leading-4 font-bold',
  },
})

// ── Outcome panel ─────────────────────────────────────────────────────────────
// Read-only probability breakdown card shown after both parents are selected.
export const outcomePanel = tv({
  slots: {
    root: 'w-full mb-5 border-[3px] border-outline',
    body: 'px-4 py-1.5',
    title: 'text-[13px] font-bold uppercase tracking-widest mb-1.5',
    row: 'flex-row items-center mb-1 gap-2',
    label: 'text-[13px] text-on-surface font-bold w-[90px]',
    track: 'flex-1 h-2 bg-surface-container-highest rounded overflow-hidden',
    fill: 'h-full rounded',
    value: 'text-sm font-bold text-on-surface w-11 text-right',
  },
})

// ── Parent slots row ──────────────────────────────────────────────────────────
// Row container with two parent slot cards and a multiply separator.
export const parentSlotsRow = tv({
  slots: {
    root: 'flex-row items-stretch justify-center mb-6 w-full',
    separator: 'w-[36px] justify-center items-center',
    separatorText: 'text-[26px] font-bold text-on-surface',
  },
})

// ── Breed result section ──────────────────────────────────────────────────────
// Layout for the success state shown after a breed completes.
export const breedResultSection = tv({
  slots: {
    root: 'items-center w-full',
    title: 'text-[26px] font-black text-on-surface mb-5 text-center',
    parentsRow: 'flex-row items-center mb-5 gap-2',
    parentImage: 'w-[52px] h-[52px] rounded-lg border border-outline',
    multiplyText: 'text-lg text-on-surface-variant font-bold',
    arrowText: 'text-[22px] text-on-surface font-bold',
  },
})

// ── Cost strikethrough ────────────────────────────────────────────────────────
// Inline strikethrough text for the original cost inside action button labels.
export const costStrikethrough = tv({
  base: 'line-through text-on-surface-variant',
})
