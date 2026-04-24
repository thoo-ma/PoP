import type { ReactNode } from 'react'
import { memo } from 'react'
import { Text, View } from 'react-native'
import { cn } from '@/components/ui'
import { emptyState } from '@/layouts'

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
    <View className={cn(s.root(), className)} accessibilityLiveRegion="polite">
      {icon != null && <View className={s.icon()}>{icon}</View>}
      <Text className={s.title()}>{title}</Text>
      {description != null && <Text className={s.description()}>{description}</Text>}
      {action != null && <View className={s.action()}>{action}</View>}
    </View>
  )
})
