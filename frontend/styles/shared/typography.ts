import { tv } from 'tailwind-variants'

export const screenTitle = tv({
  base: 'text-heading-lg font-black text-center text-foreground',
  variants: {
    spacing: {
      sm: 'mb-2',
      md: 'mb-3',
    },
  },
  defaultVariants: { spacing: 'md' },
})

export const badgeLabel = tv({
  base: 'text-accent-foreground font-bold',
  variants: {
    size: {
      base: 'text-body-md',
      xs: 'text-body-sm',
      sm: 'text-caption',
      tiny: 'text-caption-sm',
    },
  },
  defaultVariants: { size: 'xs' },
})
