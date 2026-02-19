import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/shared/ScreenError.styles';

interface ScreenErrorProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export default memo(function ScreenError({ title, message, onRetry }: ScreenErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
