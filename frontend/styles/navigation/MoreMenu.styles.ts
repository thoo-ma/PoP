import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bgOverlayDark,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    paddingBottom: 100,
    paddingHorizontal: spacing.lg,
  },
  menu: {
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    padding: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  menuTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    borderRadius: radii.md,
    gap: spacing.md,
  },
  menuItemActive: {
    backgroundColor: colors.bgLight,
  },
  menuItemText: {
    fontSize: fontSizes.base,
    color: colors.text,
    fontWeight: fontWeights.medium,
  },
  menuItemTextActive: {
    color: colors.title,
    fontWeight: fontWeights.semibold,
  },
});
