import { tv } from 'tailwind-variants'

export const emptyState = tv({
  slots: {
    root: 'py-12 items-center',
    title: 'text-base font-bold text-on-surface mb-2',
    detail: 'text-sm text-on-surface-variant text-center font-bold',
  },
})

export const errorMessage = tv({
  base: 'text-[13px] text-danger text-center mb-3 px-2',
})

export const dialogBody = tv({
  base: 'mb-4 gap-1.5',
})

// ── Sign-out confirmation dialog ──────────────────────────────────────────────
// Declarative confirm dialog built in useSignOutDialog().
export const signOutDialog = tv({
  slots: {
    content: 'mx-6 rounded-3xl px-6 pt-6 pb-8 border-[3px] border-outline',
    buttonRow: 'flex-row gap-3',
  },
})

// ── Dialog panel ─────────────────────────────────────────────────────────────
// Shared Dialog.Content + Dialog.Close styling for Profile and Wallet modals.
export const dialogPanel = tv({
  slots: {
    content: 'mx-auto w-[85%] max-w-[400px] rounded-3xl px-8 py-8 items-center',
    close: 'absolute top-4 right-4',
  },
})

// ── Info box ─────────────────────────────────────────────────────────────────
// Generic rounded container used in Breed (dashed) and Repair (solid).
export const infoBox = tv({
  base: 'w-full bg-surface-container-low rounded-2xl p-4 border-[3px] border-outline',
  variants: {
    border: {
      solid: '',
      dashed: 'border-dashed rounded-[14px] p-5 items-center',
    },
  },
  defaultVariants: { border: 'solid' },
})

// ── Stat allocation modal ─────────────────────────────────────────────────────
// Bottom-sheet dialog for allocating stat points after a level-up.
export const statModal = tv({
  slots: {
    content: 'px-6 pt-5 pb-10 rounded-t-3xl',
    header: 'flex-row items-center justify-between mb-1',
    title: 'text-lg font-black text-on-surface',
    description: 'text-sm text-on-surface-variant mb-5 font-bold',
    pointsBox:
      'flex-row items-center justify-between bg-surface-container-low rounded-2xl py-2.5 px-4 mb-5',
    pointsLabel: 'text-sm font-bold text-on-surface-variant',
    pointsValue: 'text-2xl font-extrabold text-on-surface',
    sliderRow: 'mb-4',
    sliderHeader: 'flex-row items-center justify-between mb-1',
    statLabel: 'text-sm font-bold text-on-surface-variant',
    statValue: 'text-sm font-bold text-on-surface',
    errorText: 'text-sm text-danger text-center mb-2',
    buttonRow: 'flex-row gap-3 mt-2',
  },
})

// ── Mystery box reveal modal ───────────────────────────────────────────────────
// Celebration dialog shown after opening a mystery box.
export const revealModal = tv({
  slots: {
    content: 'mx-6 rounded-3xl px-6 pt-6 pb-8 items-center border-[3px] border-outline',
    titleLg: 'text-xl font-black text-on-surface mb-1 text-center',
    titleMd: 'text-base font-black text-on-surface mb-1 text-center',
    description: 'text-sm text-on-surface-variant mb-5 text-center font-bold',
    imageContainer:
      'w-[70%] aspect-square rounded-xl overflow-hidden bg-surface-container-low mb-4 relative',
    rarityOverlay: 'absolute bottom-2 right-2 px-2.5 py-1 rounded-md',
    rarityText: 'text-white text-xs font-bold tracking-wide',
  },
})

// ── Breed picker modal ────────────────────────────────────────────────────────
// Bottom-sheet header + help text for the NFT parent picker.
export const pickerModal = tv({
  slots: {
    helpText: 'text-sm text-on-surface-variant px-5 pt-2.5 pb-1 leading-[18px] font-bold',
  },
})

// ── Bust message ──────────────────────────────────────────────────────────────
// Degen-bust feedback box — used in both Breed and Repair screens.
export const bustMessage = tv({
  slots: {
    root: 'w-full mb-3 p-4 rounded-xl bg-danger/10 border border-danger items-center',
    title: 'text-2xl font-bold text-danger mb-1',
    detail: 'text-sm text-on-surface-variant text-center font-bold',
  },
})
// ── Screen loader ─────────────────────────────────────────────────────────────
// Full-screen centered spinner shown while data loads.
export const screenLoader = tv({
  slots: {
    root: 'flex-1 bg-background items-center justify-center',
    message: 'mt-3 text-sm text-on-surface-variant font-bold',
  },
})

// ── Screen error ───────────────────────────────────────────────────────────────
// Full-screen centered error alert.
export const screenError = tv({
  base: 'flex-1 bg-background items-center justify-center px-6',
})

// ── Dialog footer row ─────────────────────────────────────────────────────────
// Right-aligned action row inside alert / confirm dialogs.
export const dialogFooter = tv({
  base: 'flex-row justify-end',
})

// ── Inline error ──────────────────────────────────────────────────────────────
// Centred error block used when a screen-level ScreenError is too heavy.
export const inlineError = tv({
  slots: {
    root: 'flex-1 justify-center items-center px-6',
    text: 'text-app-error text-center font-bold',
  },
})
