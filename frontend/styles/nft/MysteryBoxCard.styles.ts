import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, shadows, spacing } from '@/constants';
import { nftFragments } from '@/styles/shared';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
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
  image: {
    width: '100%',
    height: '100%',
  },
  rarityBadge: {
    ...nftFragments.badgeSm,
    bottom: spacing.sm,
    right: spacing.sm,
  },
  rarityText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  countBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.bgOverlayDarkCard,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  countText: {
    color: colors.buttonText,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  openedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.bgOverlayDarkMid,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  openedText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.semibold,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: fontWeights.bold,
    color: colors.title,
    marginBottom: spacing.xs,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.mystery,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  typeBadgeText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
});
