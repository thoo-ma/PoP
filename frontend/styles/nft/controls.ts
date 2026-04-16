import { tv } from 'tailwind-variants'

// ── Filter controls ───────────────────────────────────────────────────────────
export const filterControls = tv({
  slots: {
    root: 'px-4 pb-2',
    toolbar: 'flex-row items-center gap-2 mb-2',
    sortWrapper: 'flex-1',
    panel: 'gap-3',
    tagList: 'flex-row flex-wrap gap-2',
    selectTrigger:
      'h-[40px] py-0 bg-surface-container-low border-[3px] border-outline border-b-[6px] rounded-full px-4',
    selectValue: 'font-bold text-on-surface',
    selectIndicator: 'text-on-surface',
    selectContent: 'bg-surface border-[2px] border-outline rounded-2xl overflow-hidden',
    selectItem: 'px-4 py-2',
    tagItem: 'border-[2px] border-outline border-b-[3px] rounded-full',
  },
})

// ── Sort controls ─────────────────────────────────────────────────────────────
export const sortControls = tv({
  slots: {
    root: 'flex-row items-center gap-2 px-4 pb-2',
    selectWrapper: 'flex-1',
  },
})
