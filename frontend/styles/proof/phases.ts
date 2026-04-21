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
    root: 'flex-row items-center w-full bg-surface rounded-panel p-3 border-tactile-sm border-outline gap-3',
    avatar: 'w-14 h-14 rounded-thumbnail bg-surface-container-low',
    info: 'flex-1',
    name: 'text-body-lg font-black text-on-surface mb-0.5',
    subtitle: 'text-xs text-on-surface-variant font-bold',
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
  base: 'text-display-xl font-black',
  variants: {
    status: {
      normal: 'text-on-surface',
      danger: 'text-stat-energy',
      neutral: 'text-on-surface',
    },
  },
  defaultVariants: { status: 'neutral' },
})

// ── Status badge ─────────────────────────────────────────────────────────────
// The pill showing "Hold still" / "Movement detected" during immobility phase.
export const statusBadge = tv({
  slots: {
    root: 'py-2 px-phase-px rounded-full',
    label: 'text-sm font-bold text-on-surface',
  },
  variants: {
    status: {
      ok: { root: 'bg-app-success-container' },
      warning: { root: 'bg-app-error-container' },
    },
  },
  defaultVariants: { status: 'ok' },
})

// ── Phase text labels ─────────────────────────────────────────────────────────
// Small text labels used inside phase render functions in Poop.tsx.
export const phaseText = tv({
  slots: {
    hint: 'text-base text-on-surface-variant font-bold',
    promptTitle: 'text-xl font-bold text-app-success text-center',
    promptSubtitle: 'text-body-sm text-on-surface-variant text-center font-bold',
    statusText: 'text-base font-bold text-on-surface text-center',
  },
})

// ── DegenBar ─────────────────────────────────────────────────────────────────
// Risk slider used in Repair and Breed screens.
export const degenBar = tv({
  slots: {
    headerRow: 'flex-row items-center justify-between mb-3',
    title: 'text-base font-bold text-on-surface',
    zoneBadge: 'px-2 py-0.5 rounded-full',
    zoneBadgeLabel: 'text-xs font-bold text-white',
    sliderFill: '',
    metricsRow: 'flex-row justify-between mt-1',
    metricCol: 'flex-1 items-center',
    metricLabel: 'text-xs text-on-surface-variant mb-0.5 font-bold',
    costValue: 'text-sm font-bold text-app-success',
    costSubvalue: 'text-xs font-bold text-on-surface',
    bustValue: 'text-sm font-bold',
    bustSubvalue: 'text-xs text-on-surface-variant text-center leading-4 font-bold',
    hint: 'text-xs text-on-surface-variant text-center font-bold',
  },
  variants: {
    zone: {
      safe: {
        zoneBadge: 'bg-app-success',
        sliderFill: 'bg-app-success',
        bustValue: 'text-app-warning',
      },
      degen: {
        zoneBadge: 'bg-app-error',
        sliderFill: 'bg-app-error',
        bustValue: 'text-app-error',
      },
    },
  },
  defaultVariants: { zone: 'safe' },
})
