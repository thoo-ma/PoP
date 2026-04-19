import { tv } from 'tailwind-variants'

// ── Repair screen ─────────────────────────────────────────────────────────────
// Amount slider box inner elements.
export const repairAmountBox = tv({
  slots: {
    title: 'text-base font-bold text-on-surface mb-3',
    valueWrap: 'items-center mb-2',
    value: 'text-heading-lg font-bold text-app-success',
  },
})

// "Full energy" state shown when the selected NFT needs no repair.
export const repairFullEnergy = tv({
  slots: {
    root: 'items-center mt-6',
    text: 'text-lg font-bold text-on-surface mb-6 text-center',
  },
})
