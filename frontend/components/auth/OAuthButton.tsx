import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { useCSSVariable } from 'uniwind'
import { Button, Spinner } from '@/components/ui'
import type { OAuthProvider } from '@/types'
import TactileButton from '../shared/TactileButton'

export interface OAuthButtonProps {
  provider: OAuthProvider
  onPress: () => void
  loading: boolean
  disabled?: boolean
}

const labels = {
  google: 'Sign in with Google',
  x: 'Sign in with X',
  apple: 'Sign in with Apple',
} as const

export default function OAuthButton({ provider, onPress, loading, disabled }: OAuthButtonProps) {
  const foreground = useCSSVariable('--foreground') as string
  const label = labels[provider]

  const icon =
    provider === 'google' ? (
      <AntDesign name="google" size={18} color={foreground} className="mr-3" />
    ) : provider === 'x' ? (
      <FontAwesome6 name="x-twitter" size={18} color={foreground} className="mr-3" />
    ) : (
      // half-step mb-0.5: nudge the apple glyph to align optically with the label.
      <AntDesign name="apple" size={20} color={foreground} className="mr-3 mb-0.5" />
    )

  return (
    <TactileButton
      onPress={onPress}
      isDisabled={disabled || loading}
      className="w-full mb-4"
      accessibilityLabel={label}
    >
      {loading ? (
        <Spinner size="sm" color={foreground} />
      ) : (
        <>
          {icon}
          <Button.Label className="font-black text-foreground text-body-lg">{label}</Button.Label>
        </>
      )}
    </TactileButton>
  )
}
