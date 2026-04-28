import { tv } from '@/lib/tv'

// ── Auth screen layout ────────────────────────────────────────────────────────
export const authScreen = tv({
  slots: {
    scrim: 'flex-1 bg-background',
    root: 'flex-1 bg-background px-6 pt-20 pb-8',
    innerRoot: 'flex-1 px-6 pt-20 pb-8',
    content: 'flex-1 justify-center',
    logoWrap: 'items-center mb-8',
    headline: 'text-display-lg font-black tracking-tighter text-foreground text-center',
    tagline: 'text-body-md font-bold text-muted text-center mt-4 mb-10',
    inputWrap: 'mb-8',
    actionsWrap: 'mt-auto',
    footer: 'flex-row justify-center gap-6',
    // half-step: keeps the underline tight to the link text.
    footerLink: 'border-b border-border pb-0.5',
    footerLinkText: 'text-caption font-black text-muted uppercase tracking-wider',
    fieldError: 'text-danger text-center mt-3 font-bold',
  },
})
