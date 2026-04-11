import { tv } from 'tailwind-variants'

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
