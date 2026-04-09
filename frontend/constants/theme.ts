export const colors = {
  // Base UI
  primary: '#000',

  // Status colors
  success: '#4ade80',

  // NFT stat colors
  efficiency: '#3b82f6',
  resilience: '#10b981',
  comfort: '#f59e0b',
  luck: '#8b5cf6',
  energy: '#ef4444',

  // UI Elements
  active: '#000',
  inactive: '#d1d5db',

  // Button states
  buttonText: '#fff',
}

import type { NFTRarity } from '@pop/shared'

export const RARITY_COLORS: Record<NFTRarity, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  legendary: '#f59e0b',
  transcendent: '#a855f7',
}
