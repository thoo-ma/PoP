import { Text } from 'react-native';
import { navigationHintStyles as styles } from '../../styles';

interface NavigationHintProps {
  text: string;
}

/**
 * Reusable component for displaying navigation hints at the bottom of screens
 */
export default function NavigationHint({ text }: NavigationHintProps) {
  return <Text style={styles.hint}>{text}</Text>;
}
