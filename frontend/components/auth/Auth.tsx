import { FontAwesome6 } from '@expo/vector-icons'
import * as AppleAuthentication from 'expo-apple-authentication'
import * as WebBrowser from 'expo-web-browser'
import { Button, cn, LinkButton, Spinner, useToast } from 'heroui-native'
import { useState } from 'react'
import { Linking, Platform, Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import OAuthButton from '@/components/auth/OAuthButton'
import { supabase } from '@/lib'
import { authScreen, tactileButtonText } from '@/styles/auth'
import type { OAuthProvider } from '@/types'
import { getErrorMessage, logError } from '@/utils'
import TactileButton from '../shared/TactileButton'

WebBrowser.maybeCompleteAuthSession()

export default function Auth() {
  const { toast } = useToast()
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
  const [devLoading, setDevLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const onSurface = useCSSVariable('--color-on-surface') as string
  const s = authScreen()

  const handleDevSignIn = async () => {
    setDevLoading(true)
    try {
      const { error } = await supabase.auth.signInAnonymously()
      if (error) throw error

      const { error: seedError } = await supabase.functions.invoke('seed-dev-test-nfts')
      if (seedError) {
        console.warn('Failed to seed test NFTs:', seedError)
      }
    } catch (err) {
      logError('Auth:Anonymous', err)
      toast.show({
        variant: 'danger',
        label: 'Authentication Error',
        description: getErrorMessage(err, 'Failed to authenticate'),
      })
    } finally {
      setDevLoading(false)
    }
  }

  const handleTestSignIn = async () => {
    setTestLoading(true)
    try {
      const { error } = await supabase.auth.signInAnonymously()
      if (error) throw error

      const { error: seedError } = await supabase.rpc('seed_test_mystery_boxes')
      if (seedError) {
        console.warn('Failed to seed test mystery boxes:', seedError)
      }
    } catch (err) {
      logError('Auth:TestMode', err)
      toast.show({
        variant: 'danger',
        label: 'Authentication Error',
        description: getErrorMessage(err, 'Failed to authenticate'),
      })
    } finally {
      setTestLoading(false)
    }
  }

  const signInWithProvider = async (provider: OAuthProvider) => {
    setLoadingProvider(provider)
    try {
      const redirectTo = Platform.OS === 'web' ? window.location.origin : 'pop://auth/callback'
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      })
      if (error) throw error
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
        if (result.type === 'success') {
          const url = new URL(result.url)
          const code = url.searchParams.get('code')
          if (!code) throw new Error('No authorization code returned')
          await supabase.auth.exchangeCodeForSession(code)
        }
      }
    } catch (err) {
      logError('Auth:OAuth', err)
      toast.show({
        variant: 'danger',
        label: 'Authentication Error',
        description: getErrorMessage(err, 'Failed to authenticate'),
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  const handleAppleSignIn = async () => {
    setLoadingProvider('apple')
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      if (!credential.identityToken) throw new Error('No identity token returned from Apple')
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      })
      if (error) throw error
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && err.code === 'ERR_REQUEST_CANCELED') return
      logError('Auth:Apple', err)
      toast.show({
        variant: 'danger',
        label: 'Authentication Error',
        description: getErrorMessage(err, 'Failed to authenticate with Apple'),
      })
    } finally {
      setLoadingProvider(null)
    }
  }

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
              <FontAwesome6 name="flask" size={16} color={onSurface} style={{ marginRight: 12 }} />
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
                <FontAwesome6 name="code" size={16} color={onSurface} style={{ marginRight: 12 }} />
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
