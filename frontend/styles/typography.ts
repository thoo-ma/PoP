import { tv } from 'tailwind-variants'

// ── Text size scale ───────────────────────────────────────────────────────────
// Maps intent names to pixel values. Use these instead of bare pixel classes.
export const textSize = {
  tiny: 'text-[10px]',
  xs: 'text-[11px]',
  sm: 'text-[13px]',
  base: 'text-[15px]',
  md: 'text-[17px]',
  lg: 'text-[22px]',
  xl: 'text-[32px]',
  display: 'text-[48px]',
  hero: 'text-[80px]',
} as const

export const screenTitle = tv({
  base: 'text-[32px] font-black text-center text-on-surface',
  variants: {
    spacing: {
      sm: 'mb-2',
      md: 'mb-3',
    },
  },
  defaultVariants: { spacing: 'md' },
})

export const badgeLabel = tv({
  base: 'text-white font-bold',
  variants: {
    size: {
      base: 'text-sm',
      xs: 'text-xs',
      sm: 'text-[11px]',
      tiny: 'text-[10px]',
    },
  },
  defaultVariants: { size: 'xs' },
})
