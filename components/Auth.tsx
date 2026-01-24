import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { supabase, isExpoGo } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import type { Provider } from '@supabase/supabase-js';
import type { OAuthProvider, OAuthButtonProps } from '../types';
import { getRedirectUrl } from '../utils/urlHelpers';
import { styles } from '../styles/Auth.styles';

WebBrowser.maybeCompleteAuthSession();

function OAuthButton({ provider, onPress, loading }: OAuthButtonProps) {
  const isGoogle = provider === 'google';
  const buttonStyle = isGoogle ? styles.googleButton : styles.twitterButton;
  const textStyle = isGoogle ? [styles.buttonText, styles.googleText] : styles.buttonText;
  const loaderColor = isGoogle ? '#1F1F1F' : '#fff';
  const label = isGoogle ? 'Continue with Google' : 'Continue with 𝕏';

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={loading}
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <View style={styles.buttonContent}>
          {isGoogle && <AntDesign name="google" size={20} color="#1F1F1F" style={styles.icon} />}
          <Text style={textStyle}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);

  const signInWithProvider = async (provider: OAuthProvider) => {
    if (isExpoGo) {
      Alert.alert(
        'OAuth Not Available',
        'OAuth authentication does not work in Expo Go due to deep linking limitations.\n\nPlease use a development build to test OAuth, or use the web version.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          skipBrowserRedirect: false,
          redirectTo: getRedirectUrl(),
        },
      });

      if (error) throw error;

      if (data?.url) {
        if (Platform.OS === 'web') {
          window.location.href = data.url;
        } else {
          await WebBrowser.openBrowserAsync(data.url);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      Alert.alert('Connection error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pop</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {isExpoGo && (
        <>
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠️ Expo Go detected</Text>
            <Text style={styles.warningSubtext}>
              OAuth won't work. Use a dev build or web for authentication.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.devBypassButton}
            onPress={async () => {
              setDevLoading(true);
              try {
                const { error } = await supabase.auth.signInAnonymously();
                
                if (error) throw error;
                
                // Success - auth state will automatically update via onAuthStateChange
              } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate';
                Alert.alert('Authentication Error', errorMessage);
                console.error('Anonymous auth error:', err);
              } finally {
                setDevLoading(false);
              }
            }}
            disabled={devLoading}
          >
            {devLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue (Dev Mode)</Text>
            )}
          </TouchableOpacity>
        </>
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
    </View>
  );
}
