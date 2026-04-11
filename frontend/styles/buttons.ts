import { tv } from 'tailwind-variants'

export const tactileButton = tv({
  base: 'h-[60px] rounded-full border-[3px] border-outline border-b-[6px] flex-row items-center justify-center active:border-b-[3px] active:translate-y-[3px]',
  variants: {
    variant: {
      //   default: 'bg-surface',
      default: 'bg-surface active:bg-surface',
      //   primary: 'bg-primary border-primary-dark border-b-primary-darker',
      primary: 'bg-primary border-primary-dark border-b-primary-darker active:bg-primary',
      outline: 'bg-transparent',
      secondary: 'bg-surface-container-low',
      disabled:
        'bg-surface-container-highest border-on-surface-variant border-b-on-surface-variant opacity-70',
    },
    size: {
      default: '',
      sm: 'h-[40px] px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export const tactileButtonText = tv({
  base: 'font-black',
  variants: {
    variant: {
      default: 'text-on-surface',
      primary: 'text-white',
      outline: 'text-on-surface',
      secondary: 'text-on-surface',
      disabled: 'text-outline',
    },
    size: {
      default: 'text-[15px]',
      sm: 'text-[13px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
