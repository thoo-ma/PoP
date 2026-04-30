import { memo } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

export const ColorSwatch = memo(function ColorSwatch({ name }: { name: string }) {
  const value = useCSSVariable(name) as string
  return (
    <View
      className="w-24 h-16 rounded-body border-hairline border-border"
      style={{ backgroundColor: value }}
    />
  )
})
