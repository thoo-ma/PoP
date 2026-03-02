import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    marginHorizontal: spacing.base,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  chanceLabel: {
    fontSize: fontSizes.base,
    color: colors.text,
  },
  chanceValue: {
    color: colors.mystery,
    fontWeight: fontWeights.bold,
  },
  holdsBadge: {
    fontSize: fontSizes.sm,
    color: colors.info,
    fontStyle: 'italic',
  },
  maxHoldNotice: {
    fontSize: fontSizes.sm,
    color: colors.amber,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.errorLight,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  holdButton: {
    flex: 1,
    backgroundColor: colors.bgLight,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  holdButtonText: {
    color: colors.textDark,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
  },
  rollButton: {
    flex: 1,
    backgroundColor: colors.mystery,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  rollButtonText: {
    color: colors.buttonText,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  winBox: {
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successBg,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  winTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.extrabold,
    color: colors.successTextDark,
  },
  winSub: {
    fontSize: fontSizes.md,
    color: colors.successTextDark,
    textAlign: 'center',
  },
  lossBox: {
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.bgLight,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  lossTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  lossSub: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: colors.buttonSecondary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  doneButtonText: {
    color: colors.buttonTextDark,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
  },
});
