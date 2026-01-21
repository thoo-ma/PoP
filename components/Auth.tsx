import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { supabase, isExpoGo } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import type { Provider } from '@supabase/supabase-js';
import type { OAuthProvider, OAuthButtonProps } from '../types';

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
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const getRedirectUrl = (): string => {
    return Platform.OS === 'web' ? window.location.origin : 'pop://';
  };

  const handleExpoGoBypass = () => {
    Alert.alert(
      'Development Mode',
      'OAuth authentication does not work in Expo Go. Please build a development client to test OAuth.\n\nFor now, continuing without authentication.',
      [
        {
          text: 'OK',
          onPress: () => {
            // User acknowledges - app will show "not authenticated" state
            // In a real scenario, you could set a mock session here for testing UI
          },
        },
      ]
    );
  };

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
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ Expo Go detected</Text>
          <Text style={styles.warningSubtext}>
            OAuth won't work. Use a dev build or web for authentication.
          </Text>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 14,
    color: '#856404',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  twitterButton: {
    backgroundColor: '#000000',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleText: {
    color: '#1F1F1F',
  },
});
