import { tv } from 'tailwind-variants'

// ── Breed picker card ────────────────────────────────────────────────────────
// Grid item card used in BreedPickerModal's 2-column NFT list.
// Uses the wrapper+container pattern (like NFTCard) so RN renders the border
// correctly at the corners — wrapper carries border+radius, container clips.
export const breedPickerCard = tv({
  slots: {
    wrapper: 'border-tactile-sm border-outline rounded-xl',
    root: 'overflow-hidden rounded-lg p-0',
    image: 'w-full aspect-square relative',
    rarityDot: 'absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-hairline border-surface',
    disabledOverlay: 'absolute inset-0 bg-surface-overlay-dim',
    info: 'px-2 pt-1.5 pb-2',
    name: 'text-body-md font-bold',
    rarity: 'text-caption font-bold capitalize',
  },
  variants: {
    disabled: {
      true: { wrapper: 'opacity-disabled-heavy', name: 'text-on-surface-variant' },
      false: { wrapper: '', name: 'text-on-surface' },
    },
  },
  defaultVariants: { disabled: false },
})

// ── Marketplace item row ──────────────────────────────────────────────────────────
// Price + action button row in buy/sell listing cards.
export const marketplaceItemRow = tv({
  slots: {
    root: 'flex-row justify-between items-center',
    price: 'text-body-md font-bold text-on-surface',
  },
})
