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
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  plusIcon: {
    fontSize: 40,
    color: '#d1d5db',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
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
    backgroundColor: '#f3f4f6',
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
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadgeText: {
    color: '#fff',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  typeBadgeText: {
    color: '#fff',
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
    backgroundColor: '#000',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
  },
  poopButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  poopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successMessage: {
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: '#d1fae5',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
  },
  successDetail: {
    fontSize: 14,
    color: '#065f46',
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
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
    backgroundColor: '#f3f4f6',
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
    color: '#ef4444',
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
    backgroundColor: '#d1fae5',
  },
  statusBadgeWarning: {
    backgroundColor: '#fee2e2',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
  },

  // Phase information card
  phaseCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  phaseCardSuccess: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
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
    backgroundColor: '#ef4444',
  },

  // Primary action button (used in challenge phases)
  actionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Cancel button (bordered, secondary)
  cancelLink: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9ca3af',
    width: '100%',
    alignItems: 'center',
  },
  cancelLinkText: {
    color: '#9ca3af',
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
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  resultFailure: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  resultError: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
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
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  toastMessageText: {
    fontSize: 13,
    color: '#b91c1c',
    fontWeight: '600',
    textAlign: 'center',
  },
});
