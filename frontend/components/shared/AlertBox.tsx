import { Alert, cn } from 'heroui-native'
import { type ComponentProps, memo, type ReactNode } from 'react'
import { alertBox } from '@/styles'

type AlertBoxProps = {
  status: NonNullable<ComponentProps<typeof Alert>['status']>
  title?: string
  description?: string | (string | false | null | undefined)[]
  className?: string
  children?: ReactNode
}

export default memo(function AlertBox({
  status,
  title,
  description,
  className,
  children,
}: AlertBoxProps) {
  const s = alertBox()
  const descriptions: string[] = description
    ? Array.isArray(description)
      ? (description.filter(Boolean) as string[])
      : [description]
    : []

  return (
    <>
      <Alert status={status} className={cn(s.root(), className)}>
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
