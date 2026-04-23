import { memo } from 'react'
import { View } from 'react-native'
import { cn } from '@/components/ui'
import { progressBar } from '@/styles'

interface ProgressBarProps {
  /** Current value (0–100). Clamped internally. */
  value: number
  /** Runtime color string for the fill (e.g. from useCSSVariable). */
  color?: string
  /** Static Tailwind bg-* className for the fill (e.g. "bg-amber"). */
  colorClass?: string
  /** Bar height — sm (1 px-unit) or md (2 px-units). */
  size?: 'sm' | 'md'
  /** Extra className merged onto the track element. */
  className?: string
  accessibilityLabel?: string
}

export default memo(function ProgressBar({
  value,
  color,
  colorClass,
  size = 'md',
  className,
  accessibilityLabel,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const s = progressBar({ size })
  const accessibilityProps = accessibilityLabel
    ? {
        accessible: true,
        accessibilityLabel,
        accessibilityRole: 'progressbar' as const,
        accessibilityValue: { min: 0, max: 100, now: Math.round(clamped) },
      }
    : {}
  return (
    <View className={cn(s.track(), className)} {...accessibilityProps}>
      <View
        className={cn(s.fill(), colorClass)}
        style={{ width: `${clamped}%`, ...(color ? { backgroundColor: color } : undefined) }}
      />
    </View>
  )
})
