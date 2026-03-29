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
