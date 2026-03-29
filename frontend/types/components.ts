import type { OAuthProvider } from "./index";

/**
 * Props for OAuthButton component
 */
export interface OAuthButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  loading: boolean;
}
