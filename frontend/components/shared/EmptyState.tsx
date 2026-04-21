import { cn } from 'heroui-native'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { Text, View } from 'react-native'
import { emptyState } from '@/styles'

type EmptyStateLayout = 'inline' | 'screen'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  layout?: EmptyStateLayout
  className?: string
}

export default memo(function EmptyState({
  icon,
  title,
  description,
  action,
  layout = 'inline',
  className,
}: EmptyStateProps) {
  const s = emptyState({ layout })
  return (
    <View className={cn(s.root(), className)} accessibilityLiveRegion="polite" accessible>
      {icon != null && <View className={s.icon()}>{icon}</View>}
      <Text className={s.title()}>{title}</Text>
      {description != null && <Text className={s.description()}>{description}</Text>}
      {action != null && <View className={s.action()}>{action}</View>}
    </View>
  )
})
