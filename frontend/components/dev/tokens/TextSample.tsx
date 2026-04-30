import { memo } from 'react'
import { Text, View } from 'react-native'

export const TextSample = memo(function TextSample({
  token,
  size,
  weight,
  text,
}: {
  token: string
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
        {token} &middot; {size}
        {weight ? ` &middot; ${weight}` : ''}
      </Text>
    </View>
  )
})
