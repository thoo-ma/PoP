import { tv } from '@/lib/tv'

// ── Repair screen ─────────────────────────────────────────────────────────────
// Amount slider box inner elements.
export const repairAmountPanel = tv({
  slots: {
    title: 'text-body-base font-bold text-foreground mb-3',
    valueWrap: 'items-center mb-2',
    value: 'text-heading-lg font-bold text-success',
  },
})

// "Full energy" state shown when the selected NFT needs no repair.
export const repairFullEnergy = tv({
  slots: {
    root: 'items-center mt-6',
    text: 'text-heading-xs font-bold text-foreground mb-6 text-center',
  },
})
