import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

export const filterStyles = StyleSheet.create({
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
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#3b82f6',
  },
  filterContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  filterChipActive: {
    borderWidth: 2,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  // Rarity chip colors
  commonChip: {
    borderColor: '#94a3b8',
  },
  commonChipActive: {
    backgroundColor: '#94a3b8',
    borderColor: '#94a3b8',
  },
  rareChip: {
    borderColor: '#3b82f6',
  },
  rareChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  legendaryChip: {
    borderColor: '#f59e0b',
  },
  legendaryChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  transcendentChip: {
    borderColor: '#a855f7',
  },
  transcendentChipActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  // Tier chip colors
  'cruise-seatChip': {
    borderColor: '#94a3b8',
  },
  'cruise-seatChipActive': {
    backgroundColor: '#94a3b8',
    borderColor: '#94a3b8',
  },
  'turbo-flushChip': {
    borderColor: '#f59e0b',
  },
  'turbo-flushChipActive': {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  'zen-fortressChip': {
    borderColor: '#8b5cf6',
  },
  'zen-fortressChipActive': {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
});
