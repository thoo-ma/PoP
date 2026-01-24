import type { ViewStyle } from 'react-native';
import type { DifficultyMode, OAuthProvider } from './index';

/**
 * Props for Card component
 */
export interface CardProps {
  title: string;
  value: string;
  titleColor?: string;
  valueColor?: string;
  style?: ViewStyle;
}

/**
 * Props for OAuthButton component
 */
export interface OAuthButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  loading: boolean;
}

/**
 * Props for DifficultySelector component
 */
export interface DifficultySelectorProps {
  mode: DifficultyMode;
  onModeChange: () => void;
  disabled: boolean;
}
