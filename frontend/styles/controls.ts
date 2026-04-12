import { tv } from 'tailwind-variants'

// ── Filter controls ───────────────────────────────────────────────────────────
export const filterControls = tv({
  slots: {
    root: 'px-4 pb-2',
    toolbar: 'flex-row items-center gap-2 mb-2',
    sortWrapper: 'flex-1',
    panel: 'gap-3',
    tagList: 'flex-row flex-wrap gap-2',
  },
})

// ── Sort controls ─────────────────────────────────────────────────────────────
export const sortControls = tv({
  slots: {
    root: 'flex-row items-center gap-2 px-4 pb-2',
    selectWrapper: 'flex-1',
  },
})
