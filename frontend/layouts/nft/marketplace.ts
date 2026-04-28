import { tv } from '@/lib/tv'

// ── Breed picker card ────────────────────────────────────────────────────────
// Grid item card used in BreedPickerModal's 2-column NFT list.
// Uses the wrapper+container pattern (like NFTCard) so RN renders the border
// correctly at the corners — wrapper carries border+radius, container clips.
export const breedPickerCard = tv({
  slots: {
    wrapper: 'border-2 border-border rounded-frame',
    root: 'overflow-hidden rounded-body p-0',
    image: 'w-full aspect-square relative',
    rarityDot: 'absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-hairline border-surface',
    // `bg-black/40` inlined: the deprecated `bg-surface-overlay-dim` token is
    // being removed in PR 8 — this is the only consumer of the dim overlay.
    disabledOverlay: 'absolute inset-0 bg-black/40',
    info: 'px-2 py-2',
    name: 'text-body-md font-bold',
    rarity: 'text-caption font-bold capitalize',
  },
  variants: {
    disabled: {
      true: { wrapper: 'opacity-disabled-heavy', name: 'text-muted' },
      false: { wrapper: '', name: 'text-foreground' },
    },
  },
  defaultVariants: { disabled: false },
})

// ── Marketplace item row ──────────────────────────────────────────────────────────
// Price + action button row in buy/sell listing cards.
export const marketplaceItemRow = tv({
  slots: {
    root: 'flex-row justify-between items-center',
    price: 'text-body-md font-bold text-foreground',
  },
})
