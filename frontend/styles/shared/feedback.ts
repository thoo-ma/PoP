import { tv } from 'tailwind-variants'

export const errorMessage = tv({
  base: 'text-[13px] text-danger text-center mb-3 px-2',
})

// ── Info box ─────────────────────────────────────────────────────────────────
// Generic rounded container used in Breed (dashed) and Repair (solid).
export const infoBox = tv({
  base: 'w-full bg-surface-container-low rounded-2xl p-4 border-[3px] border-outline',
  variants: {
    border: {
      solid: '',
      dashed: 'border-dashed rounded-[14px] p-5 items-center',
    },
  },
  defaultVariants: { border: 'solid' },
})
