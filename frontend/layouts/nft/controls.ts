import { tv } from '@/lib/tv'

// ── Tactile select ────────────────────────────────────────────────────────────
// Shared tactile-styled select dropdown used across FilterControls and SortToolbar.
export const tactileSelect = tv({
  slots: {
    trigger:
      'h-control-md py-0 bg-surface-secondary border-2 border-border border-b-raise rounded-full px-4 active:translate-y-[1px]',
    value: 'font-bold text-foreground',
    indicator: 'text-foreground',
    content: 'bg-surface border-2 border-border rounded-card overflow-hidden',
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
    // TODO(redesign): chip-row layouts have diverged across the app
    // (gap-2 wrap here vs gap-1 no-wrap in parentSlot.chipsRow).
    // Reconcile before extracting a shared chipRow recipe.
    tagList: 'flex-row flex-wrap gap-2',
    tagItem: 'border-2 border-border border-b-press rounded-full',
  },
})

// ── Sort controls ─────────────────────────────────────────────────────────────
export const sortControls = tv({
  slots: {
    root: 'flex-row items-center gap-2 px-4 pb-2',
    selectWrapper: 'flex-1',
  },
})
