import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, RARITY_COLORS, spacing } from '@/constants';

export const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.base,
    paddingRight: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    height: 36,
    justifyContent: 'space-between',
    marginRight: spacing.sm,
  },
  filterToggleText: {
    fontSize: fontSizes.md,
    color: colors.title,
    fontWeight: fontWeights.semibold,
    marginRight: 6,
  },
  filterToggleIcon: {
    fontSize: fontSizes.xs,
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.info,
  },
  filterContent: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  filterSection: {
    marginBottom: spacing.sm,
  },
  filterSectionLast: {
    marginBottom: 0,
  },
  filterSectionLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.base,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterChipActive: {
    borderWidth: 2,
  },
  filterChipText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.buttonText,
    fontWeight: fontWeights.bold,
  },
  // Rarity chip colors
  commonChip: {
    borderColor: RARITY_COLORS.common,
  },
  commonChipActive: {
    backgroundColor: RARITY_COLORS.common,
    borderColor: RARITY_COLORS.common,
  },
  rareChip: {
    borderColor: RARITY_COLORS.rare,
  },
  rareChipActive: {
    backgroundColor: RARITY_COLORS.rare,
    borderColor: RARITY_COLORS.rare,
  },
  legendaryChip: {
    borderColor: RARITY_COLORS.legendary,
  },
  legendaryChipActive: {
    backgroundColor: RARITY_COLORS.legendary,
    borderColor: RARITY_COLORS.legendary,
  },
  transcendentChip: {
    borderColor: RARITY_COLORS.transcendent,
  },
  transcendentChipActive: {
    backgroundColor: RARITY_COLORS.transcendent,
    borderColor: RARITY_COLORS.transcendent,
  },
  // Type chip colors
  'cruise-seatChip': {
    borderColor: RARITY_COLORS.common,
  },
  'cruise-seatChipActive': {
    backgroundColor: RARITY_COLORS.common,
    borderColor: RARITY_COLORS.common,
  },
  'turbo-flushChip': {
    borderColor: RARITY_COLORS.legendary,
  },
  'turbo-flushChipActive': {
    backgroundColor: RARITY_COLORS.legendary,
    borderColor: RARITY_COLORS.legendary,
  },
  'zen-fortressChip': {
    borderColor: colors.luck,
  },
  'zen-fortressChipActive': {
    backgroundColor: colors.luck,
    borderColor: colors.luck,
  },
});
