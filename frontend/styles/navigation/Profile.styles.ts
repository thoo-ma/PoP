import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bgOverlayDarkHeavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    padding: spacing.sm,
    zIndex: 1,
  },
  avatarContainer: {
    marginTop: spacing.base,
    marginBottom: spacing.base,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: spacing.sm,
  },
  displayName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.title,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.bgLighter,
    borderRadius: radii.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  signOutText: {
    color: colors.buttonText,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
});
