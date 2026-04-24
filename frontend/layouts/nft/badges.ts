import { tv } from 'tailwind-variants'

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
})

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
})

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
})
