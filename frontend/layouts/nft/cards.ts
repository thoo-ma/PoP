import { tv } from '@/lib/tv'

// ── Card image container ─────────────────────────────────────────────────────
// The full-width square image wrapper used in NFTCard, MysteryBoxCard,
// and BreedPickerModal grid items.
// No border-radius here — the inner cardContainer's overflow-hidden + rounded-inset
// handles corner clipping. The outer cardWrapper carries border + rounded-card without
// overflow-hidden so React Native renders the border correctly at the corners.
export const cardImageContainer = tv({
  base: 'w-full aspect-square relative overflow-hidden',
})

// ── Card body ────────────────────────────────────────────────────────────────
// Standard body padding + gap for NFTCard and MysteryBoxCard.
export const cardBody = tv({
  base: 'p-2 gap-2',
})

// ── NFT detail card ──────────────────────────────────────────────────────────
// The larger NFT card used in the Poop idle screen and the Repair screen.
// Layout handled by cardWrapper (flat border) + cardContainer + Card compound.
export const nftDetailCard = tv({
  slots: {
    image: 'w-full h-card-image bg-surface-secondary',
    body: 'p-4',
    title: 'text-heading-xs font-black text-center text-foreground mb-3',
  },
})

// ── Card wrapper ─────────────────────────────────────────────────────────────
// Outer border shell for NFTCard and MysteryBoxCard. Carries the border +
// border-radius WITHOUT overflow-hidden, so React Native renders the border
// correctly at the corners (RN clips border when overflow-hidden is also set).
export const cardWrapper = tv({
  base: 'w-full mb-4 border-2 border-border rounded-card flex-1',
  variants: {
    border: {
      tactile: 'border-b-raise',
      flat: '',
    },
  },
  defaultVariants: { border: 'tactile' },
})

// ── Card container ────────────────────────────────────────────────────────────
// Inner card surface — handles overflow clipping. The mathematically flush
// inner radius would be 14px (outer 16px − 2px border), but `rounded-inset`
// (13px) is used intentionally — it is the nearest available token and the 1px
// difference is imperceptible on mobile.
export const cardContainer = tv({
  base: 'w-full overflow-hidden p-0 rounded-inset flex-1',
})

// ── Card title (grid card) ────────────────────────────────────────────────────
// Small bold title used in NFTCard and MysteryBoxCard grid cards.
export const cardTitle = tv({
  base: 'text-body-md font-bold',
})

// ── XP bar ────────────────────────────────────────────────────────────────────
// Level progress bar layout used in NFTCard. The track+fill is now ProgressBar.
export const xpBar = tv({
  slots: {
    row: 'flex-row items-center mt-1',
    label: 'text-body-sm font-bold w-5 text-stat-comfort',
    track: 'flex-1 mx-1',
  },
})
