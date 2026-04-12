import { memo, useMemo } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { propertiesWrapper, propertyBar } from '@/styles'

interface NFTPropertiesProps {
  efficiency: number
  resilience: number
  comfort: number
  luck: number
  energy?: number
  mode?: 'compact' | 'detailed'
  excludeProperties?: string[]
}

interface PropertyBarProps {
  label: string
  value: number
  color: string
  isCompact: boolean
}

const PropertyBar = memo(function PropertyBar({
  label,
  value,
  color,
  isCompact,
}: PropertyBarProps) {
  const mode = isCompact ? 'compact' : 'detailed'
  const s = propertyBar({ mode })
  return (
    <View
      className={s.root()}
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
    >
      <Text className={s.label()}>{label}</Text>
      <View className={s.barWrap()}>
        <View className={s.bar()}>
          <View className={s.fill()} style={{ width: `${value}%`, backgroundColor: color }} />
        </View>
        <Text className={s.value()}>{Math.round(value)}</Text>
      </View>
    </View>
  )
})

function NFTProperties({
  efficiency,
  resilience,
  comfort,
  luck,
  energy,
  mode = 'compact',
  excludeProperties,
}: NFTPropertiesProps) {
  const isCompact = mode === 'compact'
  const [efficiencyColor, resilienceColor, comfortColor, luckColor, energyColor] = useCSSVariable([
    '--color-stat-efficiency',
    '--color-stat-resilience',
    '--color-stat-comfort',
    '--color-stat-luck',
    '--color-stat-energy',
  ]) as [string, string, string, string, string]

  const filteredProperties = useMemo(() => {
    const properties = [
      { label: 'Efficiency', value: efficiency, color: efficiencyColor },
      { label: 'Resilience', value: resilience, color: resilienceColor },
      { label: 'Comfort', value: comfort, color: comfortColor },
      { label: 'Luck', value: luck, color: luckColor },
    ]
    if (energy !== undefined) {
      properties.push({ label: 'Energy', value: energy, color: energyColor })
    }
    return excludeProperties && excludeProperties.length > 0
      ? properties.filter((prop) => !excludeProperties.includes(prop.label))
      : properties
  }, [
    efficiency,
    resilience,
    comfort,
    luck,
    energy,
    excludeProperties,
    efficiencyColor,
    resilienceColor,
    comfortColor,
    luckColor,
    energyColor,
  ])

  return (
    <View className={propertiesWrapper({ mode: isCompact ? 'compact' : 'detailed' })}>
      {filteredProperties.map((prop) => (
        <PropertyBar
          key={prop.label}
          label={prop.label}
          value={prop.value}
          color={prop.color}
          isCompact={isCompact}
        />
      ))}
    </View>
  )
}

export default memo(NFTProperties)
