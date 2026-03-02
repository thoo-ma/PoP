import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  selectorArrow: {
    width: 52,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorArrowText: {
    fontSize: 22,
    lineHeight: 28,
    color: colors.title,
    fontWeight: fontWeights.normal,
  },
  selectorCounter: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: fontWeights.medium,
    minWidth: 48,
    textAlign: 'center',
  },
});
