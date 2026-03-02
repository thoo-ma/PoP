import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.title,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.lg,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  retryButton: {
    marginTop: spacing.base,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    backgroundColor: colors.buttonPrimary,
    borderRadius: radii.md,
  },
  retryButtonText: {
    color: colors.buttonText,
    fontWeight: fontWeights.semibold,
  },
});
