import { tv } from 'tailwind-variants'

// ── Screen container ──────────────────────────────────────────────────────────
// The top-level View (or ScrollView) wrapper for every screen.
// Used in Vault, Marketplace, Breed, Repair, and Poop.
export const screenContainer = tv({
  base: 'flex-1 items-center',
  variants: {
    padTop: {
      sm: 'pt-screen-top-sm',
      md: 'pt-screen-top-md',
      lg: 'pt-screen-top-md',
    },
    padX: {
      none: '',
      sm: 'px-6',
      md: 'px-5',
    },
    bg: {
      surface: 'bg-surface',
      default: 'bg-background',
      white: 'bg-surface',
    },
  },
  defaultVariants: { padX: 'none' },
})

// ── Scroll content wrapper ────────────────────────────────────────────────────
// Applied to ScrollView contentContainerClassName across all screens.
export const scrollContent = tv({
  base: '',
  variants: {
    padding: {
      md: 'px-5',
      lg: 'px-6',
    },
    // default = no tab header above; withHeader = tab bar header present; xl = extra clearance (vault)
    bottomPad: {
      default: 'pb-tab-clearance',
      withHeader: 'pb-tab-clearance-header',
      xl: 'pb-tab-clearance-xl',
    },
    align: {
      center: 'items-center w-full',
    },
  },
})

// ── Grid layout ───────────────────────────────────────────────────────────────
// Two-column NFT / mystery-box grid used in Vault and Marketplace.
export const gridLayout = tv({
  slots: {
    wrapper: 'flex-row flex-wrap justify-between w-full',
    row: 'flex-row justify-between w-full',
    item: '',
  },
  variants: {
    columns: {
      two: {
        item: 'w-[48%]',
      },
    },
  },
  defaultVariants: { columns: 'two' },
})

// ── NFT picker button ─────────────────────────────────────────────────────────
// The dashed-border "Select NFT from Vault" placeholder shown in Poop and
// Repair before the user picks an NFT.
export const nftPickerButton = tv({
  base: 'w-nft-picker-w h-nft-picker-h rounded-card border-2 border-dashed border-border flex-col',
})
