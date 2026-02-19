import { memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '@/constants';
import { styles } from '@/styles/shared/ScreenLoader.styles';

interface ScreenLoaderProps {
  title: string;
  message?: string;
}

export default memo(function ScreenLoader({ title, message }: ScreenLoaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ActivityIndicator size="large" color={colors.info} style={styles.indicator} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
});
