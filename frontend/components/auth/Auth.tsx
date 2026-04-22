import { FontAwesome6 } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { Button, cn, LinkButton, Spinner } from 'heroui-native'
import { Linking, Platform, Text, View } from 'react-native'
import OAuthButton from '@/components/auth/OAuthButton'
import { useAuthForm } from '@/hooks'
import { authScreen, tactileButtonText } from '@/styles/auth'
import TactileButton from '../shared/TactileButton'

WebBrowser.maybeCompleteAuthSession()

export default function Auth() {
  const {
    loadingProvider,
    devLoading,
    testLoading,
    onSurface,
    handleDevSignIn,
    handleTestSignIn,
    signInWithProvider,
    handleAppleSignIn,
  } = useAuthForm()
  const s = authScreen()

  return (
    <View className={s.root()}>
      <View className={s.content()}>
        <Text className={s.headline()}>
          DETECT.{'\n'}FLUSH.{'\n'}EARN.
        </Text>

        <Text className={s.tagline()}>The world's first tactile proof-of-potty protocol.</Text>

        <TactileButton
          onPress={handleTestSignIn}
          isDisabled={testLoading}
          className="w-full mb-4"
          accessibilityLabel="Sign in in Test Mode"
        >
          {testLoading ? (
            <Spinner size="sm" color={onSurface} />
          ) : (
            <>
              <FontAwesome6 name="flask" size={16} color={onSurface} className="mr-3" />
              <Button.Label className={tactileButtonText({ variant: 'default' })}>
                Sign in in Test Mode
              </Button.Label>
            </>
          )}
        </TactileButton>

        {__DEV__ && (
          <TactileButton
            onPress={handleDevSignIn}
            isDisabled={devLoading}
            className="w-full mb-4"
            accessibilityLabel="Sign in in Dev Mode"
          >
            {devLoading ? (
              <Spinner size="sm" color={onSurface} />
            ) : (
              <>
                <FontAwesome6 name="code" size={16} color={onSurface} className="mr-3" />
                <Button.Label className={tactileButtonText({ variant: 'default' })}>
                  Sign in in Dev Mode
                </Button.Label>
              </>
            )}
          </TactileButton>
        )}

        <OAuthButton
          provider="x"
          onPress={() => signInWithProvider('x')}
          loading={loadingProvider === 'x'}
          disabled={loadingProvider !== null}
        />

        <OAuthButton
          provider="google"
          onPress={() => signInWithProvider('google')}
          loading={loadingProvider === 'google'}
          disabled={loadingProvider !== null}
        />

        {Platform.OS === 'ios' && (
          <OAuthButton
            provider="apple"
            onPress={handleAppleSignIn}
            loading={loadingProvider === 'apple'}
            disabled={loadingProvider !== null}
          />
        )}
      </View>

      <View className={cn(s.footer(), 'mt-auto pt-8')}>
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
  )
}
