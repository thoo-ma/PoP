import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib';
import * as WebBrowser from 'expo-web-browser';
import type { OAuthProvider } from '@/types';
import { getErrorMessage, logError } from '@/utils';
import { authStyles as styles } from '@/styles';
import OAuthButton from './OAuthButton';
import PasswordPromptModal from './PasswordPromptModal';
import { colors } from '@/constants';

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
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

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
      Alert.alert('Authentication Error', getErrorMessage(err, 'Failed to authenticate'));
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
      Alert.alert('Access Denied', 'Incorrect password.');
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
      Alert.alert('Authentication Error', getErrorMessage(err, 'Failed to authenticate'));
    } finally {
      setTestLoading(false);
    }
  };

  const signInWithProvider = async (_provider: OAuthProvider) => {
    Alert.alert(
      'OAuth Not Available',
      'OAuth authentication is not yet available.\n\nPlease use Test Mode or Dev Mode to sign in.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pop</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity
        style={styles.testModeButton}
        onPress={handleTestSignIn}
        disabled={testLoading}
        accessibilityLabel="Continue in test mode"
        accessibilityRole="button"
        accessibilityHint="Sign in anonymously with one mystery box of each rarity"
        accessibilityState={{ disabled: testLoading }}
      >
        {testLoading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Continue (Test Mode)</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.devBypassButton}
        onPress={handleDevModePress}
        disabled={devLoading}
        accessibilityLabel="Continue in development mode"
        accessibilityRole="button"
        accessibilityHint="Sign in anonymously for testing purposes (password required)"
        accessibilityState={{ disabled: devLoading }}
      >
        {devLoading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Continue (Dev Mode)</Text>
        )}
      </TouchableOpacity>

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
    </View>
  );
}
