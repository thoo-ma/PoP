import { useState } from 'react'
import { View, Text, Platform } from 'react-native'
import { Button, Spinner, useToast, cn } from 'heroui-native'
import { screenTitle, screenSubtitle } from '@/styles'
import { supabase } from '@/lib'
import * as WebBrowser from 'expo-web-browser'
import * as AppleAuthentication from 'expo-apple-authentication'
import type { OAuthProvider } from '@/types'
import { getErrorMessage, logError } from '@/utils'
import OAuthButton from './OAuthButton'

WebBrowser.maybeCompleteAuthSession()

export default function Auth() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [devLoading, setDevLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)

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
    setLoading(true)
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
      setLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setAppleLoading(true)
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
      // User cancelled the native sheet — not an error
      if (err instanceof Error && 'code' in err && err.code === 'ERR_REQUEST_CANCELED') return
      logError('Auth:Apple', err)
      toast.show({
        variant: 'danger',
        label: 'Authentication Error',
        description: getErrorMessage(err, 'Failed to authenticate with Apple'),
      })
    } finally {
      setAppleLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center p-5 bg-background">
      <Text className={screenTitle({ spacing: 'sm', color: 'none' })}>Welcome to Pop</Text>
      <Text className={cn(screenSubtitle({ color: 'gray' }), 'mb-10')}>Sign in to continue</Text>

      <Button
        variant="primary"
        onPress={handleTestSignIn}
        isDisabled={testLoading}
        className="mb-4 bg-[#1a6b5a]"
        accessibilityLabel="Continue in test mode"
        accessibilityHint="Sign in anonymously with one mystery box of each rarity"
      >
        {testLoading ? <Spinner size="sm" color="#fff" /> : 'Continue (Test Mode)'}
      </Button>

      {__DEV__ && (
        <Button
          variant="primary"
          onPress={handleDevSignIn}
          isDisabled={devLoading}
          className="mb-4"
          accessibilityLabel="Continue in development mode"
          accessibilityHint="Sign in anonymously with seeded NFTs (dev builds only)"
        >
          {devLoading ? <Spinner size="sm" color="#fff" /> : 'Continue (Dev Mode)'}
        </Button>
      )}

      <OAuthButton
        provider="twitter"
        onPress={() => signInWithProvider('twitter')}
        loading={loading}
      />

      <OAuthButton
        provider="google"
        onPress={() => signInWithProvider('google')}
        loading={loading}
      />

      {Platform.OS === 'ios' && (
        <OAuthButton
          provider="apple"
          onPress={handleAppleSignIn}
          loading={appleLoading}
        />
      )}
    </View>
  )
}
