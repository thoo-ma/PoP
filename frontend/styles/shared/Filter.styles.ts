import { StyleSheet } from 'react-native';
import { colors, RARITY_COLORS } from '@/constants';

export const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    height: 36,
    justifyContent: 'space-between',
    marginRight: 8,
  },
  filterToggleText: {
    fontSize: 14,
    color: colors.title,
    fontWeight: '600',
    marginRight: 6,
  },
  filterToggleIcon: {
    fontSize: 10,
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.info,
  },
  filterContent: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginTop: 8,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterSectionLast: {
    marginBottom: 0,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  filterChipActive: {
    borderWidth: 2,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
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
  // Tier chip colors
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
