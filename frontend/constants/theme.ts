export const colors = {
  // Base UI
  background: '#fff',
  primary: '#000',

  // Text
  title: '#374151',
  text: '#6b7280',
  textLight: '#999',
  textDark: '#1e293b',

  // Status colors
  success: '#4ade80',
  error: '#dc2626',
  errorLight: '#ef4444',    // standard red-500; also used as energy NFT stat
  warning: '#ff6b6b',
  info: '#3B82F6',

  // NFT Properties
  efficiency: '#3b82f6',
  resilience: '#10b981',
  comfort: '#f59e0b',
  luck: '#8b5cf6',
  energy: '#ef4444',
  level: '#6366f1',

  // UI Elements
  active: '#000',
  inactive: '#d1d5db',
  disabled: '#9CA3AF',
  border: '#e5e7eb',
  borderLight: '#d1d5db',

  // Backgrounds
  bgLight: '#f3f4f6',
  bgLighter: '#f9fafb',
  bgSurface: '#fff',
  bgSurface2: '#f8fafc',      // subtly off-white surface (cards, panels)
  bgOverlay: 'rgba(255, 255, 255, 0.9)',
  bgOverlayFull: 'rgba(255, 255, 255, 0.95)',
  bgDimOverlay: 'rgba(255, 255, 255, 0.5)',  // picker dim overlay
  bgOverlayDark: 'rgba(0, 0, 0, 0.5)',       // modal scrim
  bgOverlayDarkMid: 'rgba(0, 0, 0, 0.55)',   // bottom-sheet scrim
  bgOverlayDarkCard: 'rgba(0, 0, 0, 0.65)',  // card badge overlay
  bgOverlayDarkHeavy: 'rgba(0, 0, 0, 0.70)', // heavy scrim

  // Selection / highlight
  selectionBg: '#f0f9ff',    // active item background in menus

  // Property bars
  propertyBg: '#e2e8f0',
  propertyText: '#475569',
  propertyValue: '#1e293b',

  // Shadows
  shadow: '#000',

  // Specific components
  slider: '#1e293b',
  mystery: '#7c3aed',           // MysteryBox action button (violet)
  amber: '#fbbf24',             // progress/repair preview bar
  resilienceBadgeBg: 'rgba(16, 185, 129, 0.95)', // repair resilience badge overlay

  // Button states
  buttonPrimary: '#000',
  buttonSecondary: '#d1d5db',
  buttonSuccess: '#10b981',
  buttonText: '#fff',
  buttonTextDark: '#1F1F1F',

  // Feedback state tints
  successBg: '#d1fae5',
  successTextDark: '#065f46',
  errorBg: '#fee2e2',
  errorDark: '#991B1B',
  toastBorder: '#fca5a5',
  toastText: '#b91c1c',
  resultWarningBg: '#fef3c7',  // amber-tinted result card

  // Warning (auth / system alerts)
  warningBg: '#FFF3CD',
  warningBorder: '#FFC107',
  warningText: '#856404',
  warningTextDark: '#78350f',  // deep amber warning/info text (amber-900)
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const fontSizes = {
  xxs: 9,
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
} as const;

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 24,
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

import type { NFTRarity } from '@pop/shared';

export const RARITY_COLORS: Record<NFTRarity, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  legendary: '#f59e0b',
  transcendent: '#a855f7',
};

export const typography = {
  title: {
    fontSize: fontSizes.display,
    fontWeight: 'bold' as const,
    marginBottom: spacing.md,
    textAlign: 'center' as const,
  },
  description: {
    fontSize: fontSizes.base,
    marginBottom: 48,
    textAlign: 'center' as const,
    lineHeight: fontSizes.xxl,
  },
};

export const layout = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.lg,
  },
};
