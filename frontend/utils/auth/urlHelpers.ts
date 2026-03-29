import { Platform } from 'react-native';

/**
 * Get the appropriate OAuth redirect URL based on platform
 * @returns Redirect URL string
 */
export const getRedirectUrl = (): string => {
  return Platform.OS === 'web' ? window.location.origin : 'pop://auth/callback';
};
