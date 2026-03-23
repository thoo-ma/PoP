import { tv } from 'tailwind-variants';

export const emptyState = tv({
  slots: {
    root: 'py-12 items-center',
    title: 'text-base font-semibold text-text-title mb-2',
    detail: 'text-sm text-text-body text-center',
  },
});

export const errorMessage = tv({
  base: 'text-[13px] text-red-600 text-center mb-3 px-2',
});

export const infoBanner = tv({
  slots: {
    root: 'rounded-xl p-4 mb-5 border',
    label: 'text-sm text-center leading-5',
  },
  variants: {
    tone: {
      warning: {
        root: 'bg-[#fef3c7] border-[#fbbf24]',
        label: 'text-[#78350f]',
      },
      info: {
        root: 'bg-[#dbeafe] border-[#3b82f6]',
        label: 'text-[#1e40af]',
      },
    },
  },
  defaultVariants: {
    tone: 'warning',
  },
});

export const dialogBody = tv({
  base: 'mb-4 gap-1.5',
});
