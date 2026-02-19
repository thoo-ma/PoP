import { StyleSheet } from 'react-native';
import { colors } from '@/constants';

export const styles = StyleSheet.create({
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
