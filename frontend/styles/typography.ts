import { tv } from 'tailwind-variants'

export const screenTitle = tv({
  base: 'text-[32px] font-bold text-center',
  variants: {
    spacing: {
      sm: 'mb-2',
      md: 'mb-3',
    },
    color: {
      accent: 'text-on-surface',
      neutral: 'text-on-surface',
      default: 'text-on-surface',
      none: '',
    },
  },
  defaultVariants: { spacing: 'md', color: 'accent' },
})

export const screenSubtitle = tv({
  base: 'text-base text-center',
  variants: {
    color: {
      muted: 'text-on-surface-variant',
      gray: 'text-on-surface-variant',
      default: 'text-on-surface-variant',
    },
    spacing: {
      sm: 'mb-4',
      md: 'mb-6',
    },
  },
  defaultVariants: { color: 'muted', spacing: 'sm' },
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
