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
    fontSize: fontSizes.display,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.text,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  warningBanner: {
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radii.md,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  warningText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.warningText,
    marginBottom: spacing.xs,
  },
  warningSubtext: {
    fontSize: fontSizes.md,
    color: colors.warningText,
  },
  devBypassButton: {
    backgroundColor: colors.buttonPrimary,
    padding: spacing.base,
    borderRadius: radii.md,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  button: {
    padding: spacing.base,
    borderRadius: radii.md,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  twitterButton: {
    backgroundColor: colors.primary,
  },
  googleButton: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  googleText: {
    color: colors.buttonTextDark,
  },
});
