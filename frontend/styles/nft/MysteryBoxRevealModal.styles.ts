import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, shadows, spacing } from '@/constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bgOverlayDarkHeavy,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    ...shadows.lg,
  },
  header: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.textDark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  imageWrapper: {
    width: '70%',
    aspectRatio: 1,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgLight,
    marginBottom: spacing.base,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rarityBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    elevation: 2,
  },
  rarityText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  nftName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.title,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  nftType: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  closeButton: {
    width: '100%',
    backgroundColor: colors.mystery,
    paddingVertical: 14,
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.buttonText,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
});
