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

import type { NFTRarity } from '@shared';

export const RARITY_COLORS: Record<NFTRarity, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  legendary: '#f59e0b',
  transcendent: '#a855f7',
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  description: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center' as const,
    lineHeight: 24,
  },
};

export const layout = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
  },
};
