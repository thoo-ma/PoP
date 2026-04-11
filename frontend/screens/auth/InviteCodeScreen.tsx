import { Feather } from '@expo/vector-icons'
import { Button, cn, FieldError, Input, Spinner, TextField } from 'heroui-native'
import { useEffect, useRef, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, Text, type TextInput, View } from 'react-native'
import { colors } from '@/constants/theme'
import { useErrorHandler } from '@/hooks'
import { validateInviteCode } from '@/lib/inviteCodeApi'
import { authScreen, tactileButton, tactileButtonText } from '@/styles/auth'
import { useSignOutDialog } from '@/utils'

interface InviteCodeScreenProps {
  onApprovalSuccess: () => void
  onSignOut: () => void
}

export default function InviteCodeScreen({ onApprovalSuccess, onSignOut }: InviteCodeScreenProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { error, handleError, clearError } = useErrorHandler('InviteCode')
  const inputRef = useRef<TextInput>(null)
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog()
  const s = authScreen()

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const isValidFormat = (text: string): boolean => {
    return /^[A-Z0-9]{8}$/.test(text)
  }

  const handleCodeChange = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setCode(cleaned.slice(0, 8))
    clearError()
  }

  const handleSubmit = async () => {
    if (!isValidFormat(code)) {
      handleError(
        new Error('Code must be 8 alphanumeric characters'),
        'Code must be 8 alphanumeric characters',
      )
      return
    }

    setLoading(true)
    clearError()

    try {
      const result = await validateInviteCode(code)
      if (result.success) {
        setCode('')
        clearError()
        onApprovalSuccess()
      } else {
        handleError(result.error || 'Invalid invite code', result.error || 'Invalid invite code')
      }
    } catch (err) {
      handleError(err, 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    showSignOutDialog(onSignOut)
  }

  const canSubmit = code.length === 8 && !loading

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={s.scrim()}
      >
        <View className={s.innerRoot()}>
          <View className={s.logoWrap()}>
            <Image
              source={require('@/assets/icon.png')}
              className="w-16 h-16 rounded-2xl"
              resizeMode="contain"
            />
          </View>

          <Text className={s.headline()}>
            ENTER.{'\n'}YOUR.{'\n'}CODE.
          </Text>

          <Text className={s.tagline()}>The world's first tactile proof-of-potty protocol.</Text>

          <View className={s.inputWrap()}>
            <TextField isInvalid={!!error}>
              <Input
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                placeholder="ABC12XYZ"
                placeholderTextColor={colors.onSurfaceVariant}
                maxLength={8}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
                keyboardType="ascii-capable"
                returnKeyType="done"
                editable={!loading}
                onSubmitEditing={handleSubmit}
                className={s.codeInput()}
              />
              {error ? <FieldError className={s.fieldError()}>{error}</FieldError> : null}
            </TextField>
          </View>

          <View className={s.actionsWrap()}>
            <Button
              onPress={handleSubmit}
              isDisabled={!canSubmit}
              className={cn(
                tactileButton({ variant: canSubmit ? 'default' : 'disabled' }),
                'w-full mb-4',
              )}
              accessibilityLabel="Submit invite code"
              variant="ghost"
              feedbackVariant="none"
            >
              {loading ? (
                <Spinner size="sm" color={colors.onSurface} />
              ) : (
                <Button.Label
                  className={tactileButtonText({ variant: canSubmit ? 'default' : 'disabled' })}
                >
                  Submit Code
                </Button.Label>
              )}
            </Button>

            <Button
              animation="disable-all"
              onPress={handleSignOut}
              isDisabled={loading}
              className={cn(tactileButton({ variant: 'default' }), 'w-full')}
              variant="ghost"
              feedbackVariant="none"
            >
              <Feather
                name="log-out"
                size={18}
                color={colors.onSurface}
                style={{ marginRight: 12 }}
              />
              <Button.Label className={tactileButtonText({ variant: 'default' })}>
                Sign Out
              </Button.Label>
            </Button>
          </View>

          <View className={cn(s.footer(), 'mt-8')}>
            <View className={s.footerLink()}>
              <Text className={s.footerLinkText()}>Privacy</Text>
            </View>
            <View className={s.footerLink()}>
              <Text className={s.footerLinkText()}>Terms</Text>
            </View>
            <View className={s.footerLink()}>
              <Text className={s.footerLinkText()}>Support</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      {signOutDialog}
    </>
  )
}
