import * as AppleAuthentication from 'expo-apple-authentication'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { Platform } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { useToast } from '@/components/ui'
import { supabase } from '@/lib'
import type { OAuthProvider } from '@/types'
import { getErrorMessage, logError } from '@/utils'

export function useAuthForm() {
  const { toast } = useToast()
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
  const [devLoading, setDevLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const foreground = useCSSVariable('--foreground') as string

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

  return {
    loadingProvider,
    devLoading,
    testLoading,
    foreground,
    handleDevSignIn,
    handleTestSignIn,
    signInWithProvider,
    handleAppleSignIn,
  }
}
