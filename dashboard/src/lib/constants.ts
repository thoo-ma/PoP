export const TYPES    = ['turbo-flush', 'cruise-seat', 'zen-fortress'] as const
export const RARITIES = ['common', 'rare', 'legendary', 'transcendent'] as const

export const RARITY_COLORS: Record<string, string> = {
  common:       '#a3a3a3',
  rare:         '#3b82f6',
  legendary:    '#f59e0b',
  transcendent: '#a855f7',
}

export const TYPE_COLORS: Record<string, string> = {
  'turbo-flush':  '#ef4444',
  'cruise-seat':  '#22c55e',
  'zen-fortress': '#3b82f6',
}
