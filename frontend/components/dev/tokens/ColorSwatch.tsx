import { memo } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

type Usage = 'app' | 'heroui' | 'unused'

const USAGE: Record<Usage, { color: string; label: string }> = {
  app: { color: 'text-muted', label: '' },
  heroui: { color: 'text-default-300', label: '· HEROUI' },
  unused: { color: 'text-danger', label: '· UNUSED' },
}

export const ColorSwatch = memo(function ColorSwatch({
  name,
  indicator,
}: {
  name: string
  indicator?: Usage
}) {
  const value = useCSSVariable(name) as string
  const usage = indicator ? USAGE[indicator] : USAGE.app
  return (
    <View className="items-center gap-1 w-28">
      <View
        className="w-28 h-16 rounded-body border-hairline border-border"
        style={{ backgroundColor: value }}
      />
      <Text className="text-caption-sm font-mono text-muted text-center" numberOfLines={1}>
        {name}
      </Text>
      <Text className={`text-caption-sm font-mono ${usage.color} text-center`}>{usage.label}</Text>
    </View>
  )
})
