import { tv } from 'tailwind-variants'

// ── Phase container ──────────────────────────────────────────────────────────
// Wraps every game phase (countdown, immobility, prompt, recording, results, roulette).
// Used 8+ times in Poop.tsx across all renderXxxPhase functions.
export const phaseContainer = tv({
  base: 'w-full items-center pt-3 gap-5',
})

// ── Challenge header ─────────────────────────────────────────────────────────
// The NFT info row shown at the top of every active game phase.
export const challengeHeader = tv({
  slots: {
    root: 'flex-row items-center w-full bg-white rounded-[14px] p-3 border border-gray-200 gap-3 shadow-sm',
    avatar: 'w-14 h-14 rounded-[10px] bg-gray-100',
    info: 'flex-1',
    name: 'text-[15px] font-bold text-gray-700 mb-0.5',
    subtitle: 'text-xs text-gray-500',
  },
})

// ── Content block ────────────────────────────────────────────────────────────
// The central content area inside countdown / immobility phases.
export const phaseContent = tv({
  base: 'items-center py-6 gap-4',
})

// ── Big timer text ───────────────────────────────────────────────────────────
// The large countdown / immobility timer number.
export const timerText = tv({
  base: 'text-[80px] font-extrabold leading-[88px]',
  variants: {
    status: {
      normal: 'text-text-title',
      danger: 'text-stat-energy',
      neutral: 'text-gray-700',
    },
  },
  defaultVariants: { status: 'neutral' },
})

// ── Status badge ─────────────────────────────────────────────────────────────
// The pill showing "Hold still" / "Movement detected" during immobility phase.
export const statusBadge = tv({
  slots: {
    root: 'py-2 px-[18px] rounded-full',
    label: 'text-sm font-semibold text-gray-700',
  },
  variants: {
    status: {
      ok: { root: 'bg-green-50' },
      warning: { root: 'bg-red-100' },
    },
  },
  defaultVariants: { status: 'ok' },
})

// ── Result card ──────────────────────────────────────────────────────────────
// The outcome card shown after flush detection (success/failure/rate-limit/error).
export const resultCard = tv({
  slots: {
    root: 'w-full rounded-2xl p-6 border-2 items-center gap-1.5',
    title: 'text-[22px] font-bold text-gray-700 text-center',
    detail: 'text-sm text-gray-500 text-center',
  },
  variants: {
    status: {
      success: { root: 'bg-green-100 border-green-500' },
      failure: { root: 'bg-red-100 border-red-500' },
      warning: { root: 'bg-amber-100 border-amber-400' },
    },
  },
})

// ── Info card ────────────────────────────────────────────────────────────────
// The white bordered card used for prompt / recording / analyzing states.
export const infoCard = tv({
  base: 'w-full bg-white rounded-[14px] p-5 border border-gray-200 items-center gap-2 shadow-sm',
})

// ── Phase text labels ─────────────────────────────────────────────────────────
// Small text labels used inside phase render functions in Poop.tsx.
export const phaseText = tv({
  slots: {
    hint: 'text-base text-gray-500 font-medium',
    promptTitle: 'text-xl font-bold text-green-600 text-center',
    promptSubtitle: 'text-[13px] text-gray-500 text-center',
    statusText: 'text-base font-semibold text-gray-700 text-center',
  },
})

// ── Repair screen ───────────────────────────────────────────────────────────────
// Amount slider box inner elements.
export const repairAmountBox = tv({
  slots: {
    title: 'text-base font-bold text-foreground mb-3',
    valueWrap: 'items-center mb-2',
    value: 'text-[32px] font-bold text-green-600',
  },
})

// Success state shown after a successful repair.
export const repairSuccess = tv({
  slots: {
    root: 'items-center mt-8 bg-green-100 p-6 rounded-2xl border-2 border-green-500',
    text: 'text-2xl font-bold text-green-600 mb-5',
  },
})

// "Full energy" state shown when the selected NFT needs no repair.
export const repairFullEnergy = tv({
  slots: {
    root: 'items-center mt-6',
    text: 'text-lg font-semibold text-foreground mb-6 text-center',
  },
})

// ── DegenBar ─────────────────────────────────────────────────────────────────
// Risk slider used in Repair and Breed screens.──
export const degenBar = tv({
  slots: {
    headerRow: 'flex-row items-center justify-between mb-3',
    title: 'text-base font-bold text-foreground',
    zoneBadge: 'px-2 py-0.5 rounded-full',
    zoneBadgeLabel: 'text-xs font-bold text-white',
    sliderFill: '',
    metricsRow: 'flex-row justify-between mt-1',
    metricCol: 'flex-1 items-center',
    metricLabel: 'text-xs text-foreground-500 mb-0.5',
    costValue: 'text-sm font-bold text-green-500',
    costSubvalue: 'text-xs font-semibold text-foreground',
    divider: 'w-px bg-border mx-2',
    bustValue: 'text-sm font-bold',
    bustSubvalue: 'text-xs text-foreground-500 text-center leading-4',
    hint: 'text-xs text-foreground-500 text-center',
  },
  variants: {
    zone: {
      safe: {
        zoneBadge: 'bg-green-600',
        sliderFill: 'bg-green-600',
        bustValue: 'text-yellow-500',
      },
      degen: {
        zoneBadge: 'bg-red-500',
        sliderFill: 'bg-red-500',
        bustValue: 'text-red-500',
      },
    },
  },
  defaultVariants: { zone: 'safe' },
})

// ── Recording indicator ──────────────────────────────────────────────────────
// The red dot + "Recording…" row.
export const recordingIndicator = tv({
  slots: {
    root: 'flex-row items-center gap-2 mb-3',
    dot: 'w-3 h-3 rounded-full bg-red-500',
    label: 'text-base font-semibold text-gray-700',
  },
})

// ── Toast banner ─────────────────────────────────────────────────────────────
// The immobility failure toast ("Too much movement — try again!").
export const toastBanner = tv({
  slots: {
    root: 'bg-red-100 rounded-[10px] py-2.5 px-4 mb-2 border border-red-300',
    label: 'text-[13px] text-red-700 font-semibold text-center',
  },
})
