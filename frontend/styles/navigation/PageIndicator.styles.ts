import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingMenu: {
    flexDirection: 'row',
    backgroundColor: colors.bgOverlayFull,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    gap: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
  },
  iconLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.inactive,
    marginTop: spacing.xs,
  },
  iconLabelActive: {
    color: colors.active,
    fontWeight: fontWeights.bold,
  },
});
