import { memo, useMemo } from 'react'
import { Text, View } from 'react-native'
import { colors } from '@/constants'

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
  return (
    <View className={isCompact ? 'flex-row items-center justify-between' : 'gap-1'}>
      <Text
        className={
          isCompact
            ? 'text-[10px] text-property-text w-[50px] mr-1'
            : 'text-xs font-semibold text-property-text mb-0.5'
        }
      >
        {label}
      </Text>
      <View
        className={
          isCompact ? 'flex-1 flex-row items-center gap-1' : 'flex-row items-center gap-1.5'
        }
      >
        <View
          className={
            isCompact
              ? 'flex-1 h-1.5 bg-property-bg rounded overflow-hidden'
              : 'flex-1 h-2 bg-property-bg rounded overflow-hidden'
          }
        >
          <View className="h-full rounded" style={{ width: `${value}%`, backgroundColor: color }} />
        </View>
        <Text
          className={
            isCompact
              ? 'text-[10px] text-property-text font-semibold w-5 text-right'
              : 'text-xs text-text-dark font-bold w-[26px] text-right'
          }
        >
          {Math.round(value)}
        </Text>
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

  const filteredProperties = useMemo(() => {
    const properties = [
      { label: 'Efficiency', value: efficiency, color: colors.efficiency },
      { label: 'Resilience', value: resilience, color: colors.resilience },
      { label: 'Comfort', value: comfort, color: colors.comfort },
      { label: 'Luck', value: luck, color: colors.luck },
    ]
    if (energy !== undefined) {
      properties.push({ label: 'Energy', value: energy, color: colors.energy })
    }
    return excludeProperties && excludeProperties.length > 0
      ? properties.filter((prop) => !excludeProperties.includes(prop.label))
      : properties
  }, [efficiency, resilience, comfort, luck, energy, excludeProperties])

  return (
    <View className={isCompact ? 'mt-2 gap-1' : 'mt-2 gap-2'}>
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
