import { tv } from 'tailwind-variants'

// ── Tactile select ────────────────────────────────────────────────────────────
// Shared tactile-styled select dropdown used across FilterControls and SortToolbar.
export const tactileSelect = tv({
  slots: {
    trigger:
      'h-control-md py-0 bg-surface-container-low border-tactile-sm border-outline border-b-tactile-lg rounded-full px-4 active:translate-y-[1px]',
    value: 'font-bold text-on-surface',
    indicator: 'text-on-surface',
    content: 'bg-surface border-2 border-outline rounded-card overflow-hidden',
    item: 'px-4 py-2',
  },
})

// ── Filter controls ───────────────────────────────────────────────────────────
export const filterControls = tv({
  slots: {
    root: 'px-4 pb-2',
    toolbar: 'flex-row items-center gap-2 mb-2',
    sortWrapper: 'flex-1',
    panel: 'gap-3',
    tagList: 'flex-row flex-wrap gap-2',
    tagItem: 'border-2 border-outline border-b-tactile-sm rounded-full',
  },
})

// ── Sort controls ─────────────────────────────────────────────────────────────
export const sortControls = tv({
  slots: {
    root: 'flex-row items-center gap-2 px-4 pb-2',
    selectWrapper: 'flex-1',
  },
})
