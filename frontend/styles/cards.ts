import { tv } from 'tailwind-variants'

// ── Card image container ─────────────────────────────────────────────────────
// The full-width square image wrapper used in NFTCard, MysteryBoxCard,
// and BreedPickerModal grid items.
export const cardImageContainer = tv({
  base: 'w-full aspect-square relative',
})

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

// ── Card body ────────────────────────────────────────────────────────────────
// Standard body padding + gap for NFTCard and MysteryBoxCard.
export const cardBody = tv({
  base: 'p-2 gap-2',
})

// ── NFT detail card ──────────────────────────────────────────────────────────
// The larger NFT card used in the Poop idle screen and the Repair screen.
export const nftDetailCard = tv({
  slots: {
    root: 'rounded-2xl overflow-hidden shadow-md border',
    imageWrap: 'relative w-full overflow-hidden',
    image: 'w-full h-[280px] bg-default',
    content: 'w-full',
    title: 'text-lg font-bold text-center',
  },
})

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

// ── Skeleton card ────────────────────────────────────────────────────────────
// Placeholder shimmer lines used in Vault and Marketplace loading states.
export const skeletonCard = tv({
  slots: {
    image: 'aspect-square w-full rounded-xl',
    titleLine: 'h-4 w-3/4 rounded-md mt-2',
    subtitleLine: 'h-3 w-1/2 rounded-md mt-1',
  },
})

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
})

// ── Card container ────────────────────────────────────────────────────────────
// Standard full-width grid card wrapper — NFTCard and MysteryBoxCard.
export const cardContainer = tv({
  base: 'w-full mb-4 overflow-hidden p-0',
})

// ── Card title (grid card) ────────────────────────────────────────────────────
// Small bold title used in NFTCard and MysteryBoxCard grid cards.
export const cardTitle = tv({
  base: 'text-sm font-bold',
})

// ── XP bar ────────────────────────────────────────────────────────────────────
// Level progress bar used in NFTCard.
export const xpBar = tv({
  slots: {
    row: 'flex-row items-center mt-1',
    label: 'text-xs font-semibold w-5 text-stat-comfort',
    track: 'flex-1 mx-1',
    bg: 'h-1 rounded-full overflow-hidden bg-gray-200',
    fill: 'h-full rounded-full bg-yellow-400',
  },
})

// ── Loot roulette card ────────────────────────────────────────────────────────
// Layout slots for the LootRouletteCard component.
export const lootCard = tv({
  slots: {
    root: 'mx-4 items-center gap-4',
    body: 'items-center gap-4 w-full',
    title: 'text-xl font-bold',
    chanceValue: 'font-bold text-stat-luck',
    holdText: 'text-sm italic text-stat-efficiency',
    maxHoldText: 'text-sm italic text-stat-comfort',
    rollError: 'text-sm text-center text-stat-energy',
    buttonRow: 'flex-row gap-3 w-full mt-2',
  },
})

// ── Loot result panel ─────────────────────────────────────────────────────────
// Won / lost outcome panel shown after a loot roll.
export const lootResultPanel = tv({
  slots: {
    root: 'items-center gap-2 rounded-xl py-4 px-6 w-full',
    title: 'text-center',
    body: 'text-base text-center',
  },
  variants: {
    status: {
      won: {
        root: 'bg-green-100',
        title: 'text-2xl font-extrabold text-emerald-900',
        body: 'text-emerald-900',
      },
      lost: {
        root: 'bg-surface-light',
        title: 'text-xl font-bold text-text-title',
        body: 'text-text-body',
      },
    },
  },
})

// ── Property bar ──────────────────────────────────────────────────────────────
// Stat bar row (label + track + value) used in NFTProperties.
// mode='compact'  → tight single-row layout (used in grid cards)
// mode='detailed' → stacked layout with larger bar (used in detail views)
export const propertyBar = tv({
  slots: {
    root: '',
    label: 'text-property-text',
    barWrap: 'flex-row items-center',
    bar: 'flex-1 bg-property-bg rounded overflow-hidden',
    fill: 'h-full rounded',
    value: 'text-right font-semibold',
  },
  variants: {
    mode: {
      compact: {
        root: 'flex-row items-center justify-between',
        label: 'text-[10px] w-[50px] mr-1',
        barWrap: 'flex-1 gap-1',
        bar: 'h-1.5',
        value: 'text-[10px] text-property-text w-5',
      },
      detailed: {
        root: 'gap-1',
        label: 'text-xs font-semibold mb-0.5',
        barWrap: 'gap-1.5',
        bar: 'h-2',
        value: 'text-xs text-text-dark font-bold w-[26px]',
      },
    },
  },
  defaultVariants: { mode: 'compact' },
})

// ── Properties wrapper ────────────────────────────────────────────────────────
// Outer container for the NFTProperties list.
export const propertiesWrapper = tv({
  base: 'mt-2',
  variants: {
    mode: {
      compact: 'gap-1',
      detailed: 'gap-2',
    },
  },
  defaultVariants: { mode: 'compact' },
})

// ── NFT picker placeholder ──────────────────────────────────────────────────────────
// Empty-state text inside the picker Button when no NFT is selected.
// Poop uses tint:'gray'; Repair uses the default tint:'muted'.
export const nftPickerPlaceholder = tv({
  slots: {
    icon: 'text-[40px] mb-3',
    label: 'text-base font-semibold',
  },
  variants: {
    tint: {
      gray: { icon: 'text-gray-400', label: 'text-gray-500' },
      muted: { icon: 'text-muted', label: 'text-muted' },
    },
  },
  defaultVariants: { tint: 'muted' },
})

// ── Marketplace item row ──────────────────────────────────────────────────────────
// Price + action button row in buy/sell listing cards.
export const marketplaceItemRow = tv({
  slots: {
    root: 'flex-row justify-between items-center',
    price: 'text-sm font-bold text-text-title',
  },
})
