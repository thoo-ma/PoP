import { tv } from 'tailwind-variants'

export const screenTitle = tv({
  base: 'text-heading-lg font-black text-center text-on-surface',
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
      sm: 'text-caption',
      tiny: 'text-caption-sm',
    },
  },
  defaultVariants: { size: 'xs' },
})
