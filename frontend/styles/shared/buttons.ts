import { tv } from 'tailwind-variants'

// ── Tactile 3D Border Convention ──────────────────────────────────────────────
// Three strict tiers; see global.css top-of-file comment.
//   Interactive (press-down): border-tactile-sm border-b-tactile-lg
//                             + active:border-b-tactile-sm
//   Passive cards:            border-tactile-sm border-b-tactile-md
//   Static containers:        border-tactile-sm (uniform)
//
// `border-2` (2px) is the lighter non-tactile static border tier — used by
// dashed slots, dropdown content, and tag pills. It is intentionally separate
// from the tactile scale and never carries a raised bottom.

export const tactileButton = tv({
  base: 'h-control-lg rounded-full border-tactile-sm border-outline border-b-tactile-lg flex-row items-center justify-center active:border-b-tactile-sm active:translate-y-[3px]',
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
// Square nav arrow button used in NFTSelector. Uses the passive-card raise
// (border-tactile-md = 5px) over the static border-2 base; pressing collapses
// to border-tactile-sm (3px) for a 2px translate-y delta — same press feel as
// the legacy 4px→2px setup.
export const tactileNavButton = tv({
  base: [
    'w-12 h-12 rounded-2xl bg-surface',
    'border-2 border-surface-container-highest border-b-tactile-md',
    'flex-row items-center justify-center',
    'active:border-b-tactile-sm active:translate-y-[2px]',
  ],
})
