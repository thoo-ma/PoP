/**
 * Project-configured tailwind-variants and cn.
 *
 * Root cause of the text-display-* bug
 * ─────────────────────────────────────
 * tailwind-merge v3 uses a prefix trie. Every unrecognised `text-*` class
 * (one that doesn't match a known font-size, text-color, alignment, etc.
 * classifier) falls into the same catch-all bucket for the `text-` prefix.
 * Both `text-display-lg` (our custom font-size token) and `text-foreground`
 * (our custom color token) land in that catch-all — they conflict, and the
 * LAST one wins. So `text-display-lg text-foreground` silently drops
 * `text-display-lg`, while `text-[48px] text-foreground` works fine because
 * `text-[48px]` matches `isArbitraryLength` and is classified as font-size.
 *
 * Fix: extend tailwind-merge's `theme.text` with our custom font-size token
 * suffixes. They then land in the `font-size` group — separate from the
 * unclassified catch-all — so font-size and text-color classes coexist safely.
 *
 * Keep the `theme.text` list in sync with `--text-*` tokens in global.css.
 *
 * IMPORT RULE: ALL app code must import `tv` and `cn` from here, never
 * directly from `tailwind-variants` or `heroui-native`.
 */

import { cnMerge, createTV, type VariantProps } from 'tailwind-variants'

const twMergeConfig = {
  theme: {
    /**
     * Custom font-size token suffixes from global.css @theme --text-* vars.
     * Registers them in the tailwind-merge font-size class group so they no
     * longer conflict with text-color/text-alignment/etc. classes.
     */
    text: [
      'display-xl',
      'display-lg',
      'icon-xl',
      'icon-lg',
      'heading-lg',
      'heading-md',
      'heading-sm',
      'heading-xs',
      'body-base',
      'body-xl',
      'body-lg',
      'body-md',
      'body-sm',
      'caption',
      'caption-sm',
    ],
  },
  classGroups: {
    // Keeps parity with heroui-native's cn for the app's semantic opacity utilities.
    opacity: [{ opacity: ['disabled', 'disabled-light', 'disabled-heavy'] }],
  },
}

export const tv = createTV({ twMergeConfig })

export function cn(...args: (string | undefined | null | false)[]): string {
  return cnMerge(args)({ twMerge: true, twMergeConfig }) ?? ''
}

export type { VariantProps }
