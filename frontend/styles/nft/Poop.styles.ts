import { StyleSheet } from 'react-native';
import { colors, typography } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: 8,
  },
  description: {
    ...typography.description,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  nftContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectButton: {
    width: 240,
    height: 360,
    backgroundColor: colors.bgLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  plusIcon: {
    fontSize: 40,
    color: colors.inactive,
    marginBottom: 12,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  nftCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 12,
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
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.level,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadgeText: {
    color: colors.buttonText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  typeBadgeText: {
    color: colors.buttonText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nftInfo: {
    width: '100%',
  },
  nftName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 10,
    textAlign: 'center',
  },
  poopButton: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
  },
  poopButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  poopButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  successMessage: {
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: colors.successBg,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.buttonSuccess,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.buttonSuccess,
    marginBottom: 8,
  },
  successDetail: {
    fontSize: 14,
    color: colors.successTextDark,
    marginBottom: 20,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
  },
  resetButtonText: {
    color: colors.buttonPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  // ─── Challenge phases ───────────────────────────────────────

  challengeContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    gap: 20,
  },

  // Compact NFT header shown during challenge phases
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
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
    fontWeight: '700',
    color: colors.title,
    marginBottom: 2,
  },
  challengeNFTMeta: {
    fontSize: 12,
    color: colors.text,
  },

  // Countdown overlay (used for 3-2-1 and immobility timer)
  countdownOverlay: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  countdownNumber: {
    fontSize: 80,
    fontWeight: '800',
    color: colors.title,
    lineHeight: 88,
  },
  countdownFrozen: {
    color: colors.errorLight,
  },
  countdownLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },

  // Status badge (running / warning)
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  statusBadgeRunning: {
    backgroundColor: colors.successBg,
  },
  statusBadgeWarning: {
    backgroundColor: colors.errorBg,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
  },

  // Phase information card
  phaseCard: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  phaseCardSuccess: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.buttonSuccess,
    textAlign: 'center',
  },
  phaseCardLabel: {
    fontSize: 16,
    fontWeight: '600',
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
    gap: 8,
    marginBottom: 12,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.errorLight,
  },

  // Primary action button (used in challenge phases)
  actionButton: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },

  // Cancel button (bordered, secondary)
  cancelLink: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.disabled,
    width: '100%',
    alignItems: 'center',
  },
  cancelLinkText: {
    color: colors.disabled,
    fontSize: 16,
    fontWeight: '600',
  },

  // Result cards
  resultCard: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
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
    fontWeight: '700',
    color: colors.title,
    textAlign: 'center',
  },
  resultSub: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },

  // Toast message (e.g. "Too much movement")
  toastMessage: {
    backgroundColor: colors.errorBg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.toastBorder,
  },
  toastMessageText: {
    fontSize: 13,
    color: colors.toastText,
    fontWeight: '600',
    textAlign: 'center',
  },
});
