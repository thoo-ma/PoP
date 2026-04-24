import { type ComponentProps, memo, type ReactNode } from 'react'
import { Alert, cn } from '@/components/ui'
import { alertFrame } from '@/layouts'

type AlertFrameProps = {
  status: NonNullable<ComponentProps<typeof Alert>['status']>
  title?: string
  description?: string | (string | false | null | undefined)[]
  className?: string
  children?: ReactNode
}

export default memo(function AlertFrame({
  status,
  title,
  description,
  className,
  children,
}: AlertFrameProps) {
  const s = alertFrame()
  const descriptions: string[] = description
    ? Array.isArray(description)
      ? (description.filter(Boolean) as string[])
      : [description]
    : []

  return (
    <>
      <Alert status={status} className={cn(s.root(), className)} accessibilityLiveRegion="polite">
        <Alert.Indicator />
        <Alert.Content>
          {title && <Alert.Title className={s.title()}>{title}</Alert.Title>}
          {descriptions.map((desc) => (
            <Alert.Description key={desc} className={s.description()}>
              {desc}
            </Alert.Description>
          ))}
        </Alert.Content>
      </Alert>
      {children}
    </>
  )
})
