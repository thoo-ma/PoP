import { tv } from 'tailwind-variants'

// ── Skeleton card ────────────────────────────────────────────────────────────
// Placeholder shimmer lines used in Vault and Marketplace loading states.
export const skeletonCard = tv({
  slots: {
    image: 'aspect-square w-full rounded-xl',
    titleLine: 'h-4 w-3/4 rounded-md mt-2',
    subtitleLine: 'h-3 w-1/2 rounded-md mt-1',
  },
})

// ── Breed skeleton ────────────────────────────────────────────────────────────
// Content-shaped loading placeholders for the Breed screen (parent slots,
// outcome info box, and breed button shapes).
export const breedSkeleton = tv({
  slots: {
    slotsRow: 'flex-row items-stretch justify-center mb-6 w-full',
    parentSlot: 'flex-1 aspect-square rounded-2xl',
    separator: 'w-9',
    infoFrame: 'h-20 w-full rounded-2xl mb-6',
    button: 'h-14 w-full rounded-2xl',
  },
})

// ── Repair skeleton ───────────────────────────────────────────────────────────
// Content-shaped loading placeholders for the Repair screen (picker button,
// slider box, and repair button shapes).
export const repairSkeleton = tv({
  slots: {
    pickerButton: 'h-20 w-full rounded-2xl mb-5',
    sliderBox: 'h-28 w-full rounded-2xl mb-5',
    button: 'h-14 w-full rounded-2xl',
  },
})

// ── Mystery box skeleton ──────────────────────────────────────────────────────
// Content-shaped loading placeholders for the mystery-box grid (image,
// rarity/count chip row, and open-button shape).
export const mysteryBoxSkeleton = tv({
  slots: {
    image: 'aspect-square w-full rounded-xl',
    chipsRow: 'flex-row gap-2 mt-2',
    chip: 'h-6 w-16 rounded-full',
    button: 'h-10 w-full rounded-2xl mt-2',
  },
})
