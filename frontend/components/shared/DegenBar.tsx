import {
  calcBustChance,
  calcReducedCost,
  calcReduction,
  DEGEN_ZONE_THRESHOLD,
} from '@pop/shared/degenBar'
import { cn, Slider } from 'heroui-native'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { infoBox } from '@/styles'

// Re-export for consumers that import the hash helper from this module
export { degenBarConfigHash } from '@pop/shared/degenBar'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type DegenBarProps = {
  baseCost: number
  onDegenChange: (degenPercent: number) => void
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DegenBar — a risk slider (0–100%) for paid actions (Repair, Breed).
 *
 * Shows real-time previews of cost reduction and bust probability as
 * the player drags the slider. Transitions visually from SAFE (0–24%)
 * to DEGEN (25–100%) zones.
 */
export default function DegenBar({ baseCost, onDegenChange, disabled = false }: DegenBarProps) {
  const [degenPercent, setDegenPercent] = useState(0)

  const reductionFraction = calcReduction(degenPercent)
  const reductionPct = Math.round(reductionFraction * 100)
  const bustChancePct = Math.round(calcBustChance(degenPercent) * 100)
  const reducedCost = calcReducedCost(baseCost, degenPercent)

  const isDegen = degenPercent >= DEGEN_ZONE_THRESHOLD
  const isAtZero = degenPercent === 0

  const handleChange = (v: number | number[]) => {
    const val = Array.isArray(v) ? (v[0] ?? 0) : v
    setDegenPercent(val)
    onDegenChange(val)
  }

  return (
    <View className={cn(infoBox(), 'mb-5')}>
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold text-foreground">Degen Bar</Text>
        <View className={cn('px-2 py-0.5 rounded-full', isDegen ? 'bg-red-500' : 'bg-green-600')}>
          <Text className="text-xs font-bold text-white">
            {isDegen ? 'DEGEN ZONE' : 'SAFE ZONE'}
          </Text>
        </View>
      </View>

      {/* Slider */}
      <Slider
        className="w-full mb-3"
        minValue={0}
        maxValue={100}
        value={degenPercent}
        onChange={handleChange}
        step={1}
        isDisabled={disabled}
      >
        <Slider.Track>
          <Slider.Fill className={isDegen ? 'bg-red-500' : 'bg-green-600'} />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      {/* Metrics — hidden when slider is at 0 */}
      {!isAtZero && (
        <View className="flex-row justify-between mt-1">
          {/* Cost reduction */}
          <View className="flex-1 items-center">
            <Text className="text-xs text-foreground-500 mb-0.5">Cost</Text>
            <Text className="text-sm font-bold text-green-500">−{reductionPct}%</Text>
            <Text className="text-xs font-semibold text-foreground">{reducedCost} POOP</Text>
          </View>

          {/* Divider */}
          <View className="w-px bg-border mx-2" />

          {/* Bust risk */}
          <View className="flex-1 items-center">
            <Text className="text-xs text-foreground-500 mb-0.5">Bust risk</Text>
            <Text className={cn('text-sm font-bold', isDegen ? 'text-red-500' : 'text-yellow-500')}>
              {bustChancePct}%
            </Text>
            <Text className="text-xs text-foreground-500 text-center leading-4">
              Pay full on bust
            </Text>
          </View>
        </View>
      )}

      {isAtZero && (
        <Text className="text-xs text-foreground-500 text-center">
          Drag to reduce cost — higher risk, bigger discount
        </Text>
      )}
    </View>
  )
}
