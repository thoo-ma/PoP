import { StyleSheet, Dimensions } from 'react-native';
import { colors, fontSizes, fontWeights, radii, shadows, spacing, typography } from '@/constants';
import { nftFragments } from '@/styles/shared';

const SCREEN_W = Dimensions.get('window').width;
const TILE_SIZE = (SCREEN_W - 48 - 12) / 2; // 2-col picker grid

export const styles = StyleSheet.create({

  // ─── Screen shell ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    ...typography.title,
    color: colors.title,
  },
  description: {
    ...typography.description,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    alignItems: 'center',
    width: SCREEN_W,
  },

  // ─── Parent slots row ──────────────────────────────────────────────────────
  parentsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  parentSlot: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: colors.bgSurface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  parentImage: {
    width: '100%',
    aspectRatio: 1,
  },
  parentInfo: {
    padding: spacing.sm,
    paddingBottom: spacing.xs,
  },
  parentName: {
    fontSize: 13,
    fontWeight: fontWeights.bold,
    color: colors.title,
    marginBottom: spacing.xs,
  },
  parentBadgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  parentRarityBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  parentRarityText: {
    color: colors.buttonText,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  parentChangeHint: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  parentChangeText: {
    fontSize: fontSizes.xs,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  // Empty state inside parent slot
  emptySlotInner: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
  },
  emptySlotPlus: {
    fontSize: 36,
    color: colors.borderLight,
    marginBottom: 6,
  },
  emptySlotLabel: {
    fontSize: fontSizes.sm,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 16,
  },

  // ─── VS divider ────────────────────────────────────────────────────────────
  vsColumn: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 26,
    fontWeight: fontWeights.bold,
    color: colors.title,
  },

  // ─── Outcome probability panel ─────────────────────────────────────────────
  outcomePanel: {
    width: '100%',
    backgroundColor: colors.bgLighter,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  outcomePanelTitle: {
    fontSize: 13,
    fontWeight: fontWeights.bold,
    color: colors.title,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  outcomeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  outcomeRarityLabel: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: fontWeights.semibold,
    width: 90,
  },
  outcomeBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.bgLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  outcomeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  outcomePct: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.propertyValue,
    width: 44,
    textAlign: 'right',
  },
  // Placeholder shown before both parents are chosen
  outcomePlaceholder: {
    width: '100%',
    backgroundColor: colors.bgLighter,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  outcomePlaceholderText: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ─── Breed button ──────────────────────────────────────────────────────────
  breedButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.base,
    paddingHorizontal: 48,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  breedButtonDisabled: {
    backgroundColor: colors.buttonSecondary,
    opacity: 0.6,
  },
  breedButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  breedError: {
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },

  // ─── Picker modal ──────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.bgOverlayDark,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    maxHeight: '85%',
    paddingTop: spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.title,
  },
  modalClose: {
    fontSize: fontSizes.xl,
    color: colors.text,
    fontWeight: fontWeights.semibold,
  },
  modalSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: spacing.xs,
    lineHeight: 18,
  },
  pickerGrid: {
    padding: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  pickerRow: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  pickerTile: {
    width: TILE_SIZE,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pickerTileDisabled: {
    opacity: 0.4,
  },
  pickerImage: {
    width: '100%',
    aspectRatio: 1,
  },
  pickerDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDimOverlay,
    top: 0,
    height: TILE_SIZE, // only over the image
  },
  pickerRarityDot: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.bgSurface,
  },
  pickerName: {
    paddingHorizontal: spacing.sm,
    paddingTop: 6,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.title,
  },
  pickerNameDisabled: {
    color: colors.text,
  },
  pickerRarityLabel: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    textTransform: 'capitalize',
  },

  // ─── Result screen ─────────────────────────────────────────────────────────
  resultContainer: {
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  // Mini parent thumbnails shown above the offspring card
  resultParentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  resultParentThumb: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCross: {
    fontSize: fontSizes.lg,
    color: colors.text,
    fontWeight: fontWeights.semibold,
  },
  resultArrow: {
    fontSize: 22,
    color: colors.title,
    fontWeight: fontWeights.bold,
  },
  resultCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: spacing.xl,
    borderWidth: 2,
  },
  resultImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.bgLight,
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.efficiency,
    paddingVertical: spacing.xs,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    ...shadows.md,
  },
  levelBadgeText: {
    color: colors.buttonText,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
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
  rarityBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    ...shadows.md,
  },
  rarityBadgeText: {
    color: colors.buttonText,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  resultCardContent: {
    padding: spacing.base,
    backgroundColor: colors.bgLighter,
  },
  resultLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.title,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  // ─── Reset button ──────────────────────────────────────────────────────────
  resetButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxxl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.buttonText,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
});
