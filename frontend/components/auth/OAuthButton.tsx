import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import type { OAuthButtonProps } from '@/types';
import { authStyles as styles } from '@/styles';

/**
 * Reusable OAuth sign-in button for Google and X (Twitter) providers.
 * Renders provider-specific colours, icon, and label; shows a spinner
 * while `loading` is true.
 */
export default function OAuthButton({ provider, onPress, loading }: OAuthButtonProps) {
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
