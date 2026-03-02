import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const tabStyles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bgLight,
    borderRadius: radii.lg,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  tabActive: {
    backgroundColor: colors.buttonPrimary,
  },
  tabText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  tabTextActive: {
    color: colors.buttonText,
  },
});
