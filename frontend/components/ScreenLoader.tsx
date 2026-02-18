import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants';

interface ScreenLoaderProps {
  title: string;
  message?: string;
}

export default function ScreenLoader({ title, message }: ScreenLoaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ActivityIndicator size="large" color={colors.info} style={styles.indicator} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: colors.title,
  },
  indicator: {
    marginTop: 40,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text,
  },
});
