import type { NFTRarity } from '@pop/shared'

export const colors = {
  // Base UI (Digital Atelier)
  primary: '#9b4500',
  background: '#fdf9f6',
  surface: '#fdf9f6',
  surfaceContainerLow: '#f7f3f0',
  surfaceContainerHighest: '#e5e2df',
  outline: '#897266',
  onSurface: '#1c1b1a',
  onSurfaceVariant: '#b0a39d',

  // Status colors
  success: '#4ade80',

  // NFT stat colors
  efficiency: '#3b82f6',
  resilience: '#10b981',
  comfort: '#f59e0b',
  luck: '#8b5cf6',
  energy: '#ef4444',

  // UI Elements
  active: '#1c1b1a',
  inactive: '#b0a39d',

  // Button states
  buttonText: '#fff',
}

export const RARITY_COLORS: Record<NFTRarity, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  legendary: '#f59e0b',
  transcendent: '#a855f7',
}
