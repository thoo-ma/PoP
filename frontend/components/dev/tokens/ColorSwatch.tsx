import { memo } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

export const ColorSwatch = memo(function ColorSwatch({ name }: { name: string }) {
  const value = useCSSVariable(name) as string
  const label = name.startsWith('--color-') ? name.replace('--color-', '') : name.replace('--', '')
  return (
    <View className="items-center gap-1 w-24">
      <View
        className="w-full h-16 rounded-body border-hairline border-border"
        style={{ backgroundColor: value }}
      />
      <Text className="text-caption-sm text-muted text-center">{label}</Text>
    </View>
  )
})
