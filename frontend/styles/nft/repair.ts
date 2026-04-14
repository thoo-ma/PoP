import { tv } from 'tailwind-variants'

// ── Repair screen ─────────────────────────────────────────────────────────────
// Amount slider box inner elements.
export const repairAmountBox = tv({
  slots: {
    title: 'text-base font-bold text-on-surface mb-3',
    valueWrap: 'items-center mb-2',
    value: 'text-[32px] font-bold text-app-success',
  },
})

// Success state shown after a successful repair.
export const repairSuccess = tv({
  slots: {
    root: 'items-center mt-8 bg-app-success-container p-6 rounded-2xl border-2 border-app-success',
    text: 'text-2xl font-bold text-app-success mb-5',
  },
})

// "Full energy" state shown when the selected NFT needs no repair.
export const repairFullEnergy = tv({
  slots: {
    root: 'items-center mt-6',
    text: 'text-lg font-bold text-on-surface mb-6 text-center',
  },
})
