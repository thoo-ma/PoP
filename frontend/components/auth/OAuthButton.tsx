import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { Button, cn, Spinner } from 'heroui-native'
import { colors } from '@/constants/theme'
import { tactileButton, tactileButtonText } from '@/styles/auth'
import type { OAuthButtonProps } from '@/types'

type OAuthProvider = OAuthButtonProps['provider']

const config = {
  google: {
    label: 'Sign in with Google',
    icon: (
      <AntDesign name="google" size={18} color={colors.onSurface} style={{ marginRight: 12 }} />
    ),
  },
  x: {
    label: 'Sign in with X',
    icon: (
      <FontAwesome6
        name="x-twitter"
        size={18}
        color={colors.onSurface}
        style={{ marginRight: 12 }}
      />
    ),
  },
  apple: {
    label: 'Sign in with Apple',
    icon: (
      <AntDesign
        name="apple"
        size={20}
        color={colors.onSurface}
        style={{ marginRight: 12, marginBottom: 2 }}
      />
    ),
  },
}

export default function OAuthButton({ provider, onPress, loading, disabled }: OAuthButtonProps) {
  const { label, icon } = config[provider]

  return (
    <Button
      onPress={onPress}
      isDisabled={disabled || loading}
      className={cn(tactileButton({ variant: 'default' }), 'w-full mb-4')}
      accessibilityLabel={label}
      variant="ghost"
      feedbackVariant="none"
    >
      {loading ? (
        <Spinner size="sm" color={colors.onSurface} />
      ) : (
        <>
          {icon}
          <Button.Label className={tactileButtonText({ variant: 'default' })}>{label}</Button.Label>
        </>
      )}
    </Button>
  )
}
