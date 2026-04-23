import { calcBustChance, calcReducedCost, calcReduction, DEGEN_ZONE_THRESHOLD } from '@pop/shared'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { cn, Separator, Slider } from '@/components/ui'
import { degenBar, infoFrame } from '@/styles'

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
  const s = degenBar({ zone: isDegen ? 'degen' : 'safe' })

  const handleChange = (v: number | number[]) => {
    const val = Array.isArray(v) ? (v[0] ?? 0) : v
    setDegenPercent(val)
    onDegenChange(val)
  }

  return (
    <View className={cn(infoFrame(), 'mb-5')}>
      {/* Header row */}
      <View className={s.headerRow()}>
        <Text className={s.title()}>Degen Bar</Text>
        <View
          className={s.zoneBadge()}
          accessibilityValue={{ text: isDegen ? 'DEGEN ZONE' : 'SAFE ZONE' }}
        >
          <Text className={s.zoneBadgeLabel()}>{isDegen ? 'DEGEN ZONE' : 'SAFE ZONE'}</Text>
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
        accessibilityLabel="Degen level"
        accessibilityValue={{ min: 0, max: 100, now: degenPercent }}
      >
        <Slider.Track>
          <Slider.Fill className={s.sliderFill()} />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      {/* Metrics — hidden when slider is at 0 */}
      {!isAtZero && (
        <View className={s.metricsRow()}>
          {/* Cost reduction */}
          <View className={s.metricCol()}>
            <Text className={s.metricLabel()}>Cost</Text>
            <Text className={s.costValue()}>−{reductionPct}%</Text>
            <Text className={s.costSubvalue()}>{reducedCost} POOP</Text>
          </View>

          {/* Divider */}
          <Separator orientation="vertical" className="mx-2" />

          {/* Bust risk */}
          <View className={s.metricCol()}>
            <Text className={s.metricLabel()}>Bust risk</Text>
            <Text className={s.bustValue()}>{bustChancePct}%</Text>
            <Text className={s.bustSubvalue()}>Pay full on bust</Text>
          </View>
        </View>
      )}

      {isAtZero && (
        <Text className={s.hint()}>Drag to reduce cost — higher risk, bigger discount</Text>
      )}
    </View>
  )
}
