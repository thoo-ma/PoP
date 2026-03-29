import { AntDesign } from '@expo/vector-icons'
import { Button, Spinner } from 'heroui-native'
import type { OAuthButtonProps } from '@/types'

/**
 * Reusable OAuth sign-in button for Google and X (Twitter) providers.
 * Renders provider-specific colours, icon, and label; shows a spinner
 * while `loading` is true.
 */
export default function OAuthButton({ provider, onPress, loading }: OAuthButtonProps) {
  const isGoogle = provider === 'google'
  const label = isGoogle ? 'Continue with Google' : 'Continue with 𝕏'

  return (
    <Button
      variant={isGoogle ? 'outline' : 'primary'}
      onPress={onPress}
      isDisabled={loading}
      className="mb-4"
      accessibilityLabel={label}
    >
      {loading ? (
        <Spinner size="sm" color={isGoogle ? '#1F1F1F' : '#fff'} />
      ) : (
        <>
          {isGoogle && <AntDesign name="google" size={20} color="#1F1F1F" />}
          <Button.Label className={isGoogle ? 'text-[#1F1F1F]' : ''}>{label}</Button.Label>
        </>
      )}
    </Button>
  )
}
