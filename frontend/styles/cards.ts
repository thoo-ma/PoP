import { tv } from 'tailwind-variants';

// ── Card image container ─────────────────────────────────────────────────────
// The full-width square image wrapper used in NFTCard, MysteryBoxCard,
// and BreedPickerModal grid items.
export const cardImageContainer = tv({
  base: 'w-full aspect-square relative',
});

// ── Badge position ───────────────────────────────────────────────────────────
// Absolute positioning for Chip badges overlaid on card images.
export const badgePosition = tv({
  base: '',
  variants: {
    position: {
      topLeft: 'absolute top-2 left-2',
      topRight: 'absolute top-2 right-2',
      bottomRight: 'absolute bottom-2 right-2',
      topRightOffset: 'absolute top-10 right-2',
      bottomLeft: 'absolute bottom-2 left-2',
    },
  },
});

// ── Card body ────────────────────────────────────────────────────────────────
// Standard body padding + gap for NFTCard and MysteryBoxCard.
export const cardBody = tv({
  base: 'p-2 gap-2',
});

// ── NFT detail card ──────────────────────────────────────────────────────────
// The larger NFT card used in the Poop idle screen and the Repair screen.
export const nftDetailCard = tv({
  slots: {
    root: 'rounded-2xl overflow-hidden shadow-md border',
    imageWrap: 'relative w-full overflow-hidden',
    content: 'w-full',
    title: 'text-lg font-bold text-center',
  },
});

// ── Overlay badge ────────────────────────────────────────────────────────────
// Rounded-lg badge positioned over the NFT detail card image
// (used in Poop idle and Repair for level / type / energy labels).
export const overlayBadge = tv({
  base: 'absolute rounded-lg px-3 py-1.5',
  variants: {
    position: {
      topLeft: 'top-3 left-3',
      bottomLeft: 'bottom-3 left-3',
      topRight: 'top-3 right-3',
    },
  },
});

// ── Type badge ───────────────────────────────────────────────────────────────
// Background colour by NFT type — replaces the old TYPE_BADGE_STYLES ViewStyle record.
export const typeBadge = tv({
  base: '',
  variants: {
    type: {
      'cruise-seat': 'bg-type-cruise-seat',
      'turbo-flush': 'bg-type-turbo-flush',
      'zen-fortress': 'bg-type-zen-fortress',
    },
  },
});

// ── Rarity badge ─────────────────────────────────────────────────────────────
// Background colour by NFT rarity — replaces the old RARITY_BADGE_STYLES ViewStyle record.
export const rarityBadge = tv({
  base: '',
  variants: {
    rarity: {
      common: 'bg-rarity-common',
      rare: 'bg-rarity-rare',
      legendary: 'bg-rarity-legendary',
      transcendent: 'bg-rarity-transcendent',
    },
  },
});

// ── Skeleton card ────────────────────────────────────────────────────────────
// Placeholder shimmer lines used in Vault and Marketplace loading states.
export const skeletonCard = tv({
  slots: {
    image: 'aspect-square w-full rounded-xl',
    titleLine: 'h-4 w-3/4 rounded-md mt-2',
    subtitleLine: 'h-3 w-1/2 rounded-md mt-1',
  },
});

// ── Breed picker card ────────────────────────────────────────────────────────
// Grid item card used in BreedPickerModal's 2-column NFT list.
export const breedPickerCard = tv({
  slots: {
    root: 'overflow-hidden rounded-xl p-0',
    image: 'w-full aspect-square relative',
    rarityDot: 'absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-[1.5px] border-surface',
    disabledOverlay: 'absolute inset-0 bg-white/50',
    info: 'px-2 pt-1.5 pb-2',
    name: 'text-sm font-semibold',
    rarity: 'text-[11px] font-medium capitalize',
  },
  variants: {
    disabled: {
      true: { root: 'opacity-40', name: 'text-muted' },
      false: { root: '', name: 'text-foreground' },
    },
  },
  defaultVariants: { disabled: false },
});

// ── NFT nav button ───────────────────────────────────────────────────────────
// Prev / next arrow button used in NFTSelector.
export const nftNavButton = tv({
  base: 'w-[52px] h-9 rounded-lg bg-surface-light border border-border-default',
});
