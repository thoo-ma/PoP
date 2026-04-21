import { tv } from 'tailwind-variants'

// ── Auth screen layout ────────────────────────────────────────────────────────
export const authScreen = tv({
  slots: {
    scrim: 'flex-1 bg-background',
    root: 'flex-1 bg-background px-6 pt-20 pb-8',
    innerRoot: 'flex-1 px-6 pt-20 pb-8',
    content: 'flex-1 justify-center',
    logoWrap: 'items-center mb-8',
    headline: 'text-display-lg font-black tracking-tighter text-on-surface text-center',
    tagline: 'text-body-md font-bold text-on-surface-variant text-center mt-4 mb-10',
    inputWrap: 'mb-8',
    actionsWrap: 'mt-auto',
    footer: 'flex-row justify-center gap-6',
    footerLink: 'border-b border-outline pb-0.5',
    footerLinkText: 'text-caption font-black text-on-surface-variant uppercase tracking-wider',
    fieldError: 'text-danger text-center mt-3 font-bold',
    codeInput:
      'h-16 w-full bg-surface-container-low border-tactile-sm border-surface-container-highest focus:border-outline rounded-2xl text-center text-heading-md font-black tracking-otp text-on-surface uppercase',
  },
})
