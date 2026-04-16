import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { Button, Spinner } from 'heroui-native'
import { useCSSVariable } from 'uniwind'
import { tactileButtonText } from '@/styles/auth'
import type { OAuthButtonProps } from '@/types'
import TactileButton from '../shared/TactileButton'

const labels = {
  google: 'Sign in with Google',
  x: 'Sign in with X',
  apple: 'Sign in with Apple',
} as const

export default function OAuthButton({ provider, onPress, loading, disabled }: OAuthButtonProps) {
  const onSurface = useCSSVariable('--color-on-surface') as string
  const label = labels[provider]

  const icon =
    provider === 'google' ? (
      <AntDesign name="google" size={18} color={onSurface} style={{ marginRight: 12 }} />
    ) : provider === 'x' ? (
      <FontAwesome6 name="x-twitter" size={18} color={onSurface} style={{ marginRight: 12 }} />
    ) : (
      <AntDesign
        name="apple"
        size={20}
        color={onSurface}
        style={{ marginRight: 12, marginBottom: 2 }}
      />
    )

  return (
    <TactileButton
      onPress={onPress}
      isDisabled={disabled || loading}
      className="w-full mb-4"
      accessibilityLabel={label}
    >
      {loading ? (
        <Spinner size="sm" color={onSurface} />
      ) : (
        <>
          {icon}
          <Button.Label className={tactileButtonText({ variant: 'default' })}>{label}</Button.Label>
        </>
      )}
    </TactileButton>
  )
}
