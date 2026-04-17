import { tv } from 'tailwind-variants'

// ── Card image container ─────────────────────────────────────────────────────
// The full-width square image wrapper used in NFTCard, MysteryBoxCard,
// and BreedPickerModal grid items.
// No border-radius here — the inner cardContainer's overflow-hidden + rounded-[13px]
// handles corner clipping. The outer cardWrapper carries border + rounded-2xl without
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
export const nftDetailCard = tv({
  slots: {
    root: 'rounded-2xl overflow-hidden border-[3px]',
    imageWrap: 'relative w-full overflow-hidden',
    image: 'w-full h-[280px] bg-surface-container-low',
    content: 'w-full',
    title: 'text-lg font-black text-center',
  },
})

// ── Card wrapper ─────────────────────────────────────────────────────────────
// Outer border shell for NFTCard and MysteryBoxCard. Carries the border +
// border-radius WITHOUT overflow-hidden, so React Native renders the border
// correctly at the corners (RN clips border when overflow-hidden is also set).
export const cardWrapper = tv({
  base: 'w-full mb-4 border-[3px] border-outline border-b-[5px] rounded-2xl flex-1',
})

// ── Card container ────────────────────────────────────────────────────────────
// Inner card surface — handles overflow clipping. Radius is 13px (outer 16px
// minus 3px border) so content is flush with the border's inner edge.
export const cardContainer = tv({
  base: 'w-full overflow-hidden p-0 rounded-[13px] flex-1',
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
    label: 'text-xs font-bold w-5 text-stat-comfort',
    track: 'flex-1 mx-1',
    bg: 'h-1 rounded-full overflow-hidden bg-surface-container-low',
    fill: 'h-full rounded-full bg-app-amber',
  },
})
