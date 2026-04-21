import { Feather } from '@expo/vector-icons'
import {
  Button,
  cn,
  FieldError,
  InputOTP,
  LinkButton,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  Spinner,
} from 'heroui-native'
import { useState } from 'react'
import { KeyboardAvoidingView, Linking, Platform, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { TactileButton } from '@/components'
import { Image } from '@/components/styled'
import { useErrorHandler, useSignOutDialog } from '@/hooks'
import { validateInviteCode } from '@/lib/inviteCodeApi'
import { authScreen, tactileButtonText } from '@/styles/auth'

interface InviteCodeScreenProps {
  onApprovalSuccess: () => void
  onSignOut: () => void
}

export default function InviteCodeScreen({ onApprovalSuccess, onSignOut }: InviteCodeScreenProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { error, handleError, clearError } = useErrorHandler('InviteCode')
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog()
  const onSurface = useCSSVariable('--color-on-surface') as string
  const s = authScreen()

  const isValidFormat = (text: string): boolean => {
    return /^[A-Z0-9]{8}$/.test(text)
  }

  const handleCodeChange = (text: string) => {
    setCode(text.toUpperCase().replace(/[^A-Z0-9]/g, ''))
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
              className="w-16 h-16 rounded-card"
              contentFit="contain"
            />
          </View>

          <Text className={s.headline()}>
            ENTER.{'\n'}YOUR.{'\n'}CODE.
          </Text>

          <Text className={s.tagline()}>The world's first tactile proof-of-potty protocol.</Text>

          <View className={s.inputWrap()}>
            <InputOTP
              maxLength={8}
              value={code}
              onChange={handleCodeChange}
              onComplete={handleSubmit}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              inputMode="text"
              isInvalid={!!error}
              isDisabled={loading}
              pasteTransformer={(text) => text.toUpperCase().replace(/[^A-Z0-9]/g, '')}
              textInputProps={{ autoCapitalize: 'characters' }}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
                <InputOTP.Slot index={3} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
                <InputOTP.Slot index={6} />
                <InputOTP.Slot index={7} />
              </InputOTP.Group>
            </InputOTP>
            {error ? <FieldError className={s.fieldError()}>{error}</FieldError> : null}
          </View>

          <View className={s.actionsWrap()}>
            <TactileButton
              variant={canSubmit ? 'default' : 'disabled'}
              onPress={handleSubmit}
              isDisabled={!canSubmit}
              className="w-full mb-4"
              accessibilityLabel="Submit invite code"
            >
              {loading ? <Spinner size="sm" color={onSurface} /> : 'Submit Code'}
            </TactileButton>

            <TactileButton
              animation="disable-all"
              onPress={handleSignOut}
              isDisabled={loading}
              className="w-full"
            >
              <Feather name="log-out" size={18} color={onSurface} className="mr-3" />
              <Button.Label className={tactileButtonText({ variant: 'default' })}>
                Sign Out
              </Button.Label>
            </TactileButton>
          </View>

          <View className={cn(s.footer(), 'mt-8')}>
            <LinkButton size="sm" onPress={() => Linking.openURL('https://pop.app/privacy')}>
              <LinkButton.Label className={s.footerLinkText()}>Privacy</LinkButton.Label>
            </LinkButton>
            <LinkButton size="sm" onPress={() => Linking.openURL('https://pop.app/terms')}>
              <LinkButton.Label className={s.footerLinkText()}>Terms</LinkButton.Label>
            </LinkButton>
            <LinkButton size="sm" onPress={() => Linking.openURL('https://pop.app/support')}>
              <LinkButton.Label className={s.footerLinkText()}>Support</LinkButton.Label>
            </LinkButton>
          </View>
        </View>
      </KeyboardAvoidingView>
      {signOutDialog}
    </>
  )
}
