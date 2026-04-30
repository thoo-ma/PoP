import { memo } from 'react'
import { Text, View } from 'react-native'

export const TextSample = memo(function TextSample({
  size,
  weight,
  text,
}: {
  size: string
  weight?: string
  text: string
}) {
  return (
    <View className="gap-1 w-full">
      <View className="flex-row items-baseline gap-2">
        <Text className={size + (weight ? ` ${weight}` : '')}>{text}</Text>
      </View>
      <Text className="text-caption-sm text-muted">
        {size}
        {weight ? ` &middot; ${weight}` : ''}
      </Text>
    </View>
  )
})
