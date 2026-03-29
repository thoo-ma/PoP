import { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button, Spinner, useToast, cn } from 'heroui-native';
import { screenTitle, screenSubtitle } from '@/styles';
import { supabase } from '@/lib';
import * as WebBrowser from 'expo-web-browser';
import type { OAuthProvider } from '@/types';
import { getErrorMessage, logError } from '@/utils';
import OAuthButton from './OAuthButton';

WebBrowser.maybeCompleteAuthSession();

/**
 * Auth panel that renders sign-in options:
 * - Test Mode: anonymous sign-in + seeds mystery boxes (always accessible)
 * - Dev Mode: anonymous sign-in + seeds NFTs (__DEV__ only)
 * - X / Google OAuth: currently disabled (alert shown)
 */
export default function Auth() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [oauthDialogVisible, setOauthDialogVisible] = useState(false);

  const handleDevSignIn = async () => {
    setDevLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      // Seed test NFTs for dev mode (via Edge Function — RPC is service_role only)
      const { error: seedError } = await supabase.functions.invoke('seed-dev-test-nfts');
      if (seedError) {
        console.warn('Failed to seed test NFTs:', seedError);
      }
      // Success - auth state will automatically update via onAuthStateChange
    } catch (err) {
      logError('Auth:Anonymous', err);
      toast.show({ variant: 'danger', label: 'Authentication Error', description: getErrorMessage(err, 'Failed to authenticate') });
    } finally {
      setDevLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    setTestLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      // Seed 1 mystery box of each rarity for test mode
      const { error: seedError } = await supabase.rpc('seed_test_mystery_boxes');
      if (seedError) {
        console.warn('Failed to seed test mystery boxes:', seedError);
      }
      // Success - auth state will automatically update via onAuthStateChange
    } catch (err) {
      logError('Auth:TestMode', err);
      toast.show({ variant: 'danger', label: 'Authentication Error', description: getErrorMessage(err, 'Failed to authenticate') });
    } finally {
      setTestLoading(false);
    }
  };

  const signInWithProvider = async (provider: OAuthProvider) => {
    setLoading(true);
    try {
      const redirectTo = Platform.OS === 'web' ? window.location.origin : 'pop://auth/callback';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success') {
          await supabase.auth.exchangeCodeForSession(result.url);
        }
      }
    } catch (err) {
      logError('Auth:OAuth', err);
      toast.show({ variant: 'danger', label: 'Authentication Error', description: getErrorMessage(err, 'Failed to authenticate') });
    } finally {
      setLoading(false);
    }
  };

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

      <Dialog isOpen={oauthDialogVisible} onOpenChange={setOauthDialogVisible}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className={dialogBody()}>
              <Dialog.Title>OAuth Not Available</Dialog.Title>
              <Dialog.Description>
                OAuth authentication is not yet available.{"\n\n"}Please use Test Mode or Dev Mode to sign in.
              </Dialog.Description>
            </View>
            <View className="flex-row justify-end">
              <Button variant="primary" size="sm" onPress={() => setOauthDialogVisible(false)}>
                OK
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
}
