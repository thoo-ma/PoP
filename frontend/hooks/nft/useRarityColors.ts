import type { NFTRarity } from '@pop/shared'
import { useCSSVariable } from 'uniwind'

/**
 * Returns a map of rarity → color string sourced from global.css CSS variables.
 * Reactive to theme changes.
 */
export function useRarityColors(): Record<NFTRarity, string> {
  const [common, rare, legendary, transcendent] = useCSSVariable([
    '--color-rarity-common',
    '--color-rarity-rare',
    '--color-rarity-legendary',
    '--color-rarity-transcendent',
  ]) as [string, string, string, string]

  return { common, rare, legendary, transcendent }
}
