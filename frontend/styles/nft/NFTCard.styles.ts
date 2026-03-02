import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, shadows, spacing } from '@/constants';
import { nftFragments } from '@/styles/shared';

export const styles = StyleSheet.create({
  nftCard: {
    width: '48%',
    marginBottom: spacing.base,
    borderRadius: radii.lg,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.bgLight,
    position: 'relative',
  },
  nftImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    ...nftFragments.badgeSm,
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.level,
  },
  levelText: {
    color: colors.bgSurface,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  typeBadge: {
    ...nftFragments.badgeSm,
    bottom: spacing.sm,
    left: spacing.sm,
  },
  typeText: {
    color: colors.bgSurface,
    fontSize: 8,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  rarityBadge: {
    ...nftFragments.badgeSm,
    top: spacing.sm,
    right: spacing.sm,
  },
  rarityText: {
    color: colors.bgSurface,
    fontSize: 8,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  listedBadge: {
    ...nftFragments.badgeSm,
    top: 34,
    right: spacing.sm,
    backgroundColor: colors.buttonSuccess,
  },
  listedText: {
    color: colors.bgSurface,
    fontSize: 8,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  statPointsBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.level,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  statPointsBadgeText: {
    color: colors.bgSurface,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.extrabold,
    letterSpacing: 0.3,
  },
  cardContent: {
    padding: spacing.sm,
  },
  nftName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.title,
    marginBottom: spacing.xs,
    minHeight: 32,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  xpLabel: {
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.semibold,
    color: colors.level,
    width: 20,
  },
  xpBarWrapper: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  xpBarBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.propertyBg,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.level,
  },

});
