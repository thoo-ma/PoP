import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../constants';

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
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: 'center',
    width: SCREEN_W,
  },

  // ─── Parent slots row ──────────────────────────────────────────────────────
  parentsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: 24,
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
    padding: 8,
    paddingBottom: 4,
  },
  parentName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 4,
  },
  parentBadgeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  parentRarityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  parentRarityText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  parentChangeHint: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  parentChangeText: {
    fontSize: 10,
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
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 12,
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
    fontWeight: '700',
    color: colors.title,
  },

  // ─── Outcome probability panel ─────────────────────────────────────────────
  outcomePanel: {
    width: '100%',
    backgroundColor: colors.bgLighter,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  outcomePanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  outcomeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  outcomeRarityLabel: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
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
    fontSize: 12,
    fontWeight: '700',
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
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
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
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  breedButtonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
  breedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  breedError: {
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },

  // ─── Picker modal ──────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title,
  },
  modalClose: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    lineHeight: 18,
  },
  pickerGrid: {
    padding: 16,
    paddingBottom: 40,
  },
  pickerRow: {
    gap: 12,
    marginBottom: 12,
  },
  pickerTile: {
    width: TILE_SIZE,
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
    top: 0,
    height: TILE_SIZE, // only over the image
  },
  pickerRarityDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  pickerName: {
    paddingHorizontal: 8,
    paddingTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.title,
  },
  pickerNameDisabled: {
    color: colors.text,
  },
  pickerRarityLabel: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    fontSize: 11,
    fontWeight: '500',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  // Mini parent thumbnails shown above the offspring card
  resultParentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  resultParentThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCross: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  resultArrow: {
    fontSize: 22,
    color: colors.title,
    fontWeight: '700',
  },
  resultCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 24,
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
    top: 12,
    left: 12,
    backgroundColor: '#3b82f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
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
  },
  tierBadge: {
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
  'cruise-seatBadge': { backgroundColor: '#94a3b8' },
  'turbo-flushBadge': { backgroundColor: '#f59e0b' },
  'zen-fortressBadge': { backgroundColor: '#8b5cf6' },
  tierBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rarityBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultCardContent: {
    padding: 16,
    backgroundColor: colors.bgLighter,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title,
    textAlign: 'center',
    marginBottom: 12,
  },

  // ─── Reset button ──────────────────────────────────────────────────────────
  resetButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
