import { tv } from 'tailwind-variants'

// ── Breed picker card ────────────────────────────────────────────────────────
// Grid item card used in BreedPickerModal's 2-column NFT list.
export const breedPickerCard = tv({
  slots: {
    root: 'overflow-hidden rounded-xl p-0 border-[3px] border-outline',
    image: 'w-full aspect-square relative',
    rarityDot: 'absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-[1.5px] border-surface',
    disabledOverlay: 'absolute inset-0 bg-surface-overlay-dim',
    info: 'px-2 pt-1.5 pb-2',
    name: 'text-sm font-bold',
    rarity: 'text-[11px] font-bold capitalize',
  },
  variants: {
    disabled: {
      true: { root: 'opacity-40', name: 'text-on-surface-variant' },
      false: { root: '', name: 'text-on-surface' },
    },
  },
  defaultVariants: { disabled: false },
})

// ── Marketplace item row ──────────────────────────────────────────────────────────
// Price + action button row in buy/sell listing cards.
export const marketplaceItemRow = tv({
  slots: {
    root: 'flex-row justify-between items-center',
    price: 'text-sm font-bold text-on-surface',
  },
})
