import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.text,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.semibold,
    letterSpacing: 4,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    textTransform: 'uppercase',
    backgroundColor: colors.bgLighter,
  },
  inputFocused: {
    borderColor: colors.info,
    backgroundColor: colors.bgSurface,
  },
  inputError: {
    borderColor: colors.errorLight,
  },
  submitButton: {
    backgroundColor: colors.info,
    padding: spacing.base,
    borderRadius: radii.lg,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    padding: spacing.base,
    borderRadius: radii.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutButtonText: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
  },
  errorContainer: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorLight,
    borderRadius: radii.md,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: fontSizes.md,
    textAlign: 'center',
    fontWeight: fontWeights.medium,
  },
  loadingContainer: {
    marginBottom: spacing.base,
  },
  helperText: {
    fontSize: fontSizes.sm,
    color: colors.disabled,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: spacing.xl,
  },
});
