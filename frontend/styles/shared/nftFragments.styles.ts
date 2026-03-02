import { colors, fontSizes, fontWeights, radii, spacing, shadows } from '@/constants';

// Plain objects (not StyleSheet.create) so they can be spread into StyleSheet.create calls.
export const nftFragments = {
  badgeSm: {
    position: 'absolute' as const,
    paddingVertical: spacing.xs,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    ...shadows.sm,
  },
  badgeLg: {
    position: 'absolute' as const,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    ...shadows.md,
  },
  badgeText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
};
