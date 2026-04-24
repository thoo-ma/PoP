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
    root: 'flex-row items-center w-full bg-surface rounded-panel p-3 border-2 border-border gap-3',
    avatar: 'w-14 h-14 rounded-thumbnail bg-surface-secondary',
    info: 'flex-1',
    // half-step: tight name-above-subtitle pairing inside the challenge
    // header card; whole-step breaks the grouping.
    name: 'text-body-lg font-black text-foreground mb-0.5',
    subtitle: 'text-body-sm text-muted font-bold',
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
      normal: 'text-foreground',
      danger: 'text-stat-energy',
      neutral: 'text-foreground',
    },
  },
  defaultVariants: { status: 'neutral' },
})

// ── Status badge ─────────────────────────────────────────────────────────────
// The pill showing "Hold still" / "Movement detected" during immobility phase.
export const statusBadge = tv({
  slots: {
    root: 'py-2 px-phase-px rounded-full',
    label: 'text-body-md font-bold text-foreground',
  },
  variants: {
    status: {
      ok: { root: 'bg-success-soft' },
      warning: { root: 'bg-danger-soft' },
    },
  },
  defaultVariants: { status: 'ok' },
})

// ── Phase text labels ─────────────────────────────────────────────────────────
// Small text labels used inside phase render functions in Poop.tsx.
export const phaseText = tv({
  slots: {
    hint: 'text-body-base text-muted font-bold',
    promptTitle: 'text-heading-xs font-bold text-success text-center',
    promptSubtitle: 'text-body-sm text-muted text-center font-bold',
    statusText: 'text-body-base font-bold text-foreground text-center',
  },
})

// ── DegenBar ─────────────────────────────────────────────────────────────────
// Risk slider used in Repair and Breed screens.
export const degenBar = tv({
  slots: {
    headerRow: 'flex-row items-center justify-between mb-3',
    title: 'text-body-base font-bold text-foreground',
    // half-step: pill chip for the active risk zone; whole-step inflates
    // the chip beyond the surrounding text rhythm.
    zoneBadge: 'px-2 py-0.5 rounded-full',
    zoneBadgeLabel: 'text-body-sm font-bold text-accent-foreground',
    sliderFill: '',
    metricsRow: 'flex-row justify-between mt-1',
    metricCol: 'flex-1 items-center',
    // half-step: tight label-above-value pairing per metric column.
    metricLabel: 'text-body-sm text-muted mb-0.5 font-bold',
    costValue: 'text-body-md font-bold text-success',
    costSubvalue: 'text-body-sm font-bold text-foreground',
    bustValue: 'text-body-md font-bold',
    bustSubvalue: 'text-body-sm text-muted text-center leading-4 font-bold',
    hint: 'text-body-sm text-muted text-center font-bold',
  },
  variants: {
    zone: {
      safe: {
        zoneBadge: 'bg-success',
        sliderFill: 'bg-success',
        bustValue: 'text-warning',
      },
      degen: {
        zoneBadge: 'bg-danger',
        sliderFill: 'bg-danger',
        bustValue: 'text-danger',
      },
    },
  },
  defaultVariants: { zone: 'safe' },
})
