import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing, typography } from '@/constants';
import { nftFragments } from '@/styles/shared';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.description,
    marginBottom: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.base,
    color: colors.text,
    textAlign: 'center',
  },
  nftContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  selectButton: {
    width: 240,
    height: 360,
    backgroundColor: colors.bgLight,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  plusIcon: {
    fontSize: 40,
    color: colors.inactive,
    marginBottom: spacing.md,
  },
  selectText: {
    fontSize: fontSizes.base,
    color: colors.text,
    fontWeight: fontWeights.semibold,
  },
  nftCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: colors.bgLight,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    ...nftFragments.badgeLg,
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.level,
  },
  levelBadgeText: {
    color: colors.buttonText,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  typeBadge: {
    ...nftFragments.badgeLg,
    bottom: spacing.md,
    left: spacing.md,
  },
  typeBadgeText: {
    color: colors.buttonText,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  nftInfo: {
    width: '100%',
  },
  nftName: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 10,
    textAlign: 'center',
  },
  poopButton: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 48,
    paddingVertical: spacing.base,
    borderRadius: radii.md,
  },
  poopButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  poopButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  successMessage: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    backgroundColor: colors.successBg,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.buttonSuccess,
  },
  successText: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.buttonSuccess,
    marginBottom: spacing.sm,
  },
  successDetail: {
    fontSize: fontSizes.md,
    color: colors.successTextDark,
    marginBottom: spacing.lg,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
  },
  resetButtonText: {
    color: colors.buttonPrimary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },

  // ─── Challenge phases ───────────────────────────────────────

  challengeContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.md,
    gap: spacing.lg,
  },

  // Compact NFT header shown during challenge phases
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
    gap: spacing.md,
  },
  challengeNFTAvatar: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.bgLight,
  },
  challengeNFTInfo: {
    flex: 1,
  },
  challengeNFTName: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
    color: colors.title,
    marginBottom: 2,
  },
  challengeNFTMeta: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },

  // Countdown overlay (used for 3-2-1 and immobility timer)
  countdownOverlay: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.base,
  },
  countdownNumber: {
    fontSize: 80,
    fontWeight: fontWeights.extrabold,
    color: colors.title,
    lineHeight: 88,
  },
  countdownFrozen: {
    color: colors.errorLight,
  },
  countdownLabel: {
    fontSize: fontSizes.base,
    color: colors.text,
    fontWeight: fontWeights.medium,
  },

  // Status badge (running / warning)
  statusBadge: {
    paddingVertical: spacing.sm,
    paddingHorizontal: 18,
    borderRadius: radii.xxl,
  },
  statusBadgeRunning: {
    backgroundColor: colors.successBg,
  },
  statusBadgeWarning: {
    backgroundColor: colors.errorBg,
  },
  statusBadgeText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.title,
  },

  // Phase information card
  phaseCard: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  phaseCardSuccess: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.buttonSuccess,
    textAlign: 'center',
  },
  phaseCardLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.title,
    textAlign: 'center',
  },
  phaseCardSub: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
  },

  // Recording indicator dot
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.errorLight,
  },

  // Primary action button (used in challenge phases)
  actionButton: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 48,
    paddingVertical: spacing.base,
    borderRadius: radii.md,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },

  // Cancel button (bordered, secondary)
  cancelLink: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.disabled,
    width: '100%',
    alignItems: 'center',
  },
  cancelLinkText: {
    color: colors.disabled,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },

  // Result cards
  resultCard: {
    width: '100%',
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 2,
    alignItems: 'center',
    gap: 6,
  },
  resultSuccess: {
    backgroundColor: colors.successBg,
    borderColor: colors.buttonSuccess,
  },
  resultFailure: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorLight,
  },
  resultError: {
    backgroundColor: colors.resultWarningBg,
    borderColor: colors.comfort,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    color: colors.title,
    textAlign: 'center',
  },
  resultSub: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },

  // Toast message (e.g. "Too much movement")
  toastMessage: {
    backgroundColor: colors.errorBg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.toastBorder,
  },
  toastMessageText: {
    fontSize: 13,
    color: colors.toastText,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
});
