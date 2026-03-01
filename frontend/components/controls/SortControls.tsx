import { memo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import type { SortOption } from '@/types';
import { SORT_OPTIONS } from '@/constants';
import { capitalize } from '@/utils';
import { sortStyles } from '@/styles';

interface SortControlsProps {
  /** The field currently used for sorting. */
  sortBy: SortOption;
  /** Current sort direction. */
  sortOrder: 'asc' | 'desc';
  /** Whether the sort-field dropdown is open. */
  showSortMenu: boolean;
  /** Called when the user picks a new sort field. */
  onSortByChange: (option: SortOption) => void;
  /** Called when the user toggles the sort direction. */
  onSortOrderToggle: () => void;
  /** Called when the user taps the sort button to toggle the dropdown. */
  onMenuToggle: () => void;
  /** Style object forwarded from the parent screen. */
  styles: typeof sortStyles;
}

/**
 * Sort control bar with a field-selector dropdown and an asc/desc toggle.
 * The dropdown visibility is controlled externally via `showSortMenu`.
 */
function SortControls({
  sortBy,
  sortOrder,
  showSortMenu,
  onSortByChange,
  onSortOrderToggle,
  onMenuToggle,
  styles,
}: SortControlsProps) {
  return (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      <View style={styles.sortControlGroup}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={onMenuToggle}
          accessibilityLabel={`Sort by ${sortBy}`}
          accessibilityRole="button"
          accessibilityHint="Opens sort options menu"
          accessibilityState={{ expanded: showSortMenu }}
        >
          <Text style={styles.sortButtonText}>
            {capitalize(sortBy)}
          </Text>
          <Text style={styles.sortButtonIcon}>{showSortMenu ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.sortOrderButton}
          onPress={onSortOrderToggle}
          accessibilityLabel={`Sort order: ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
          accessibilityRole="button"
          accessibilityHint="Toggle between ascending and descending order"
        >
          <Text style={styles.sortOrderIcon}>{sortOrder === 'desc' ? '↓' : '↑'}</Text>
        </TouchableOpacity>
        {showSortMenu && (
          <View style={styles.sortMenu}>
            {(SORT_OPTIONS as readonly SortOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortMenuItem,
                  sortBy === option && styles.sortMenuItemActive
                ]}
                onPress={() => onSortByChange(option)}
                accessibilityLabel={`Sort by ${option}`}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: sortBy === option }}
              >
                <Text style={[
                  styles.sortMenuItemText,
                  sortBy === option && styles.sortMenuItemTextActive
                ]}>
                  {capitalize(option)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default memo(SortControls);
