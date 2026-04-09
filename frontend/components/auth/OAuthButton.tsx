import { AntDesign } from '@expo/vector-icons'
import { Button, Spinner } from 'heroui-native'
import type { OAuthButtonProps } from '@/types'

type OAuthProvider = OAuthButtonProps['provider']

const config = {
  google: {
    label: 'Continue with Google',
    variant: 'outline' as const,
    textColor: '#1F1F1F',
    icon: 'google' as const,
  },
  x: {
    label: 'Continue with 𝕏',
    variant: 'primary' as const,
    textColor: '#fff',
    icon: undefined,
  },
  apple: {
    label: 'Continue with Apple',
    variant: 'primary' as const,
    textColor: '#fff',
    icon: 'apple' as const,
  },
} satisfies Record<
  OAuthProvider,
  {
    label: string
    variant: 'primary' | 'outline'
    textColor: string
    icon: 'google' | 'apple' | undefined
  }
>

export default function OAuthButton({ provider, onPress, loading }: OAuthButtonProps) {
  const { label, variant, textColor, icon } = config[provider]

  return (
    <Button
      variant={variant}
      onPress={onPress}
      isDisabled={loading}
      className={`mb-4 ${provider === 'apple' ? 'bg-black' : ''}`}
      accessibilityLabel={label}
    >
      {loading ? (
        <Spinner size="sm" color={textColor} />
      ) : (
        <>
          {icon && <AntDesign name={icon} size={20} color={textColor} />}
          <Button.Label style={variant === 'outline' ? { color: textColor } : undefined}>
            {label}
          </Button.Label>
        </>
      )}
    </Button>
  )
}
