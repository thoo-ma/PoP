import { tv } from 'tailwind-variants'

// ── Tactile 3D Border Convention ──────────────────────────────────────────────
// Interactive (press-down):  border-[3px] border-b-[6px] + active:border-b-[3px]
// Passive cards:             border-[3px] border-b-[5px]
// Static containers:         border-[3px] (uniform)
// Light interactive:         border-2 border-b-[4px]
// Subtle interactive:        border-2 border-b-[3px]

export const tactileButton = tv({
  base: 'h-control-lg rounded-full border-[3px] border-outline border-b-[6px] flex-row items-center justify-center active:border-b-[3px] active:translate-y-[3px]',
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
      sm: 'h-control-md px-4',
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
      primary: 'text-on-primary',
      outline: 'text-on-surface',
      secondary: 'text-on-surface',
      disabled: 'text-outline',
    },
    size: {
      default: 'text-body-lg',
      sm: 'text-body-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

// ── Tactile nav button ────────────────────────────────────────────────────────
// Square nav arrow button used in NFTSelector.
export const tactileNavButton = tv({
  base: [
    'w-12 h-12 rounded-2xl bg-surface',
    'border-2 border-surface-container-highest border-b-[4px]',
    'flex-row items-center justify-center',
    'active:border-b-2 active:translate-y-[2px]',
  ],
})
