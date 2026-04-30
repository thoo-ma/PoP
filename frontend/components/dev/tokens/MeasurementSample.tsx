import { memo } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

export const SpacingBar = memo(function SpacingBar({ name }: { name: string }) {
  const valueStr = useCSSVariable(name) as string
  const px = parseFloat(valueStr ?? '0') || 0
  return (
    <View className="gap-1 w-full">
      <View className="flex-row items-center">
        <View className="h-3 bg-accent rounded-tag" style={{ width: Math.max(px, 4) }} />
        <Text className="text-caption-sm font-mono text-muted ml-2">{px}px</Text>
      </View>
      <Text className="text-caption-sm font-mono text-muted">{name}</Text>
    </View>
  )
})

export const RadiusBox = memo(function RadiusBox({ name }: { name: string }) {
  const valueStr = useCSSVariable(name) as string
  const px = parseFloat(valueStr ?? '0') || 0
  return (
    <View className="items-center gap-1 w-28">
      <View className="w-20 h-20 bg-accent" style={{ borderRadius: px }} />
      <Text className="text-caption-sm font-mono text-muted text-center">{name}</Text>
    </View>
  )
})

export const BorderBox = memo(function BorderBox({ name }: { name: string }) {
  const valueStr = useCSSVariable(name) as string
  const px = parseFloat(valueStr ?? '0') || 0
  return (
    <View className="items-center gap-1 w-28">
      <View
        className="w-20 h-20 items-center justify-center"
        style={{ borderWidth: px, borderColor: '#9b4500' }}
      >
        <Text className="text-caption-sm font-mono text-muted">{px}px</Text>
      </View>
      <Text className="text-caption-sm font-mono text-muted text-center">{name}</Text>
    </View>
  )
})
