import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Spinner, Dialog, useToast, cn } from 'heroui-native';
import { screenTitle, screenSubtitle } from '@/styles';
import { supabase } from '@/lib';
import * as WebBrowser from 'expo-web-browser';
import type { OAuthProvider } from '@/types';
import { getErrorMessage, logError } from '@/utils';
import OAuthButton from './OAuthButton';
import PasswordPromptModal from './PasswordPromptModal';

WebBrowser.maybeCompleteAuthSession();

// TODO: remove password-gating before public release — EXPO_PUBLIC_ vars are bundled in the JS binary
const DEV_MODE_PASSWORD = process.env.EXPO_PUBLIC_DEV_MODE_PASSWORD;

/**
 * Auth panel that renders sign-in options:
 * - Test Mode: anonymous sign-in + seeds mystery boxes (always accessible)
 * - Dev Mode: anonymous sign-in + seeds NFTs (password-protected)
 * - X / Google OAuth: currently disabled (alert shown)
 */
export default function Auth() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oauthDialogVisible, setOauthDialogVisible] = useState(false);

  const handleDevSignIn = async () => {
    setDevLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      // Seed test NFTs for dev mode
      const { error: seedError } = await supabase.rpc('seed_dev_test_nfts');
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

  const handleDevModePress = () => {
    setPasswordModalVisible(true);
  };

  const handlePasswordSubmit = (password: string) => {
    setPasswordModalVisible(false);
    if (password === DEV_MODE_PASSWORD) {
      handleDevSignIn();
    } else {
      toast.show({ variant: 'danger', label: 'Access Denied', description: 'Incorrect password.' });
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

  const signInWithProvider = async (_provider: OAuthProvider) => {
    setOauthDialogVisible(true);
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

      <Button
        variant="primary"
        onPress={handleDevModePress}
        isDisabled={devLoading}
        className="mb-4"
        accessibilityLabel="Continue in development mode"
        accessibilityHint="Sign in anonymously for testing purposes (password required)"
      >
        {devLoading ? <Spinner size="sm" color="#fff" /> : 'Continue (Dev Mode)'}
      </Button>

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

      <PasswordPromptModal
        visible={passwordModalVisible}
        onSubmit={handlePasswordSubmit}
        onCancel={() => setPasswordModalVisible(false)}
      />

      <Dialog isOpen={oauthDialogVisible} onOpenChange={setOauthDialogVisible}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className="mb-4 gap-1.5">
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
