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
  errorText: {
    color: colors.error,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.buttonText,
    fontWeight: '600',
  },
});
