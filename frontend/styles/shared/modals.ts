import { tv } from 'tailwind-variants'

// ── Stat allocation modal ─────────────────────────────────────────────────────
// Bottom-sheet dialog for allocating stat points after a level-up.
export const statModal = tv({
  slots: {
    content: 'px-6 pt-5 pb-10 rounded-t-modal',
    header: 'flex-row items-center justify-between mb-1',
    title: 'text-heading-xs font-black text-on-surface',
    description: 'text-body-md text-on-surface-variant mb-5 font-bold',
    // half-step: matches statModal vertical rhythm; py-3 makes the box
    // tower over its siblings.
    pointsBox:
      'flex-row items-center justify-between bg-surface-container-low rounded-card py-2.5 px-4 mb-5',
    pointsLabel: 'text-body-md font-bold text-on-surface-variant',
    pointsValue: 'text-heading-md font-extrabold text-on-surface',
    sliderRow: 'mb-4',
    sliderHeader: 'flex-row items-center justify-between mb-1',
    statLabel: 'text-body-md font-bold text-on-surface-variant',
    statValue: 'text-body-md font-bold text-on-surface',
    errorText: 'text-body-md text-danger text-center mb-2',
    buttonRow: 'flex-row gap-3 mt-2',
  },
})

// ── Mystery box reveal modal ───────────────────────────────────────────────────
// Celebration dialog shown after opening a mystery box.
export const revealModal = tv({
  slots: {
    content: 'mx-6 rounded-modal px-6 pt-6 pb-8 items-center border-tactile-sm border-outline',
    titleLg: 'text-heading-xs font-black text-on-surface mb-1 text-center',
    titleMd: 'text-body-base font-black text-on-surface mb-1 text-center',
    description: 'text-body-md text-on-surface-variant mb-5 text-center font-bold',
    imageContainer:
      'w-[70%] aspect-square rounded-frame overflow-hidden bg-surface-container-low mb-4 relative',
    // half-step: chip-style badge on the image overlay; whole-step makes
    // the chip feel oversized for the corner.
    rarityOverlay: 'absolute bottom-2 right-2 px-2.5 py-1 rounded-tag',
    rarityText: 'text-on-primary text-body-sm font-bold tracking-wide',
  },
})

// ── Breed picker modal ────────────────────────────────────────────────────────
// Bottom-sheet help text for the NFT parent picker.
export const pickerModal = tv({
  slots: {
    helpText: 'text-body-md text-on-surface-variant px-5 py-2 leading-modal-body font-bold',
  },
})

// ── Sign-out confirmation modal ──────────────────────────────────────────────
// Declarative confirm modal built in useSignOutDialog().
export const signOutModal = tv({
  slots: {
    content: 'mx-6 rounded-modal px-6 pt-6 pb-8 border-tactile-sm border-outline',
    buttonRow: 'flex-row gap-3',
  },
})
