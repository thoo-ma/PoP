import { Alert, cn } from 'heroui-native'
import { type ComponentProps, memo, type ReactNode } from 'react'

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
  const descriptions: string[] = description
    ? Array.isArray(description)
      ? (description.filter(Boolean) as string[])
      : [description]
    : []

  return (
    <>
      <Alert
        status={status}
        className={cn('w-full rounded-2xl border-[3px] border-outline border-b-[5px]', className)}
      >
        <Alert.Indicator />
        <Alert.Content>
          {title && <Alert.Title className="font-black">{title}</Alert.Title>}
          {descriptions.map((desc) => (
            <Alert.Description key={desc} className="font-bold">
              {desc}
            </Alert.Description>
          ))}
        </Alert.Content>
      </Alert>
      {children}
    </>
  )
})
