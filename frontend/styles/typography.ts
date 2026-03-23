import { tv } from 'tailwind-variants';

export const screenTitle = tv({
  base: 'text-[32px] font-bold text-center',
  variants: {
    spacing: {
      sm: 'mb-2',
      md: 'mb-3',
    },
    color: {
      accent: 'text-text-title',
      neutral: 'text-gray-700',
      default: 'text-foreground',
    },
  },
  defaultVariants: { spacing: 'md', color: 'accent' },
});

export const screenSubtitle = tv({
  base: 'text-base text-center',
  variants: {
    color: {
      muted: 'text-text-body',
      gray: 'text-gray-500',
      default: 'text-muted',
    },
    spacing: {
      sm: 'mb-4',
      md: 'mb-6',
    },
  },
  defaultVariants: { color: 'muted', spacing: 'sm' },
});

export const badgeLabel = tv({
  base: 'text-white font-bold',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-[11px]',
      tiny: 'text-[10px]',
    },
  },
  defaultVariants: { size: 'xs' },
});

export const sectionTitle = tv({
  base: 'text-base font-bold text-foreground',
  variants: {
    spacing: {
      sm: 'mb-2',
      md: 'mb-3',
    },
  },
  defaultVariants: { spacing: 'md' },
});
