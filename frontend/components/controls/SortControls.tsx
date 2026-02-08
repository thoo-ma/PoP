import { Text, View, TouchableOpacity } from 'react-native';
import type { SortOption } from '../../types';
import { SORT_OPTIONS } from '../../constants';
import { capitalize } from '../../utils';

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  showSortMenu: boolean;
  onSortByChange: (option: SortOption) => void;
  onSortOrderToggle: () => void;
  onMenuToggle: () => void;
  styles: any;
}

export default function SortControls({
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
        >
          <Text style={styles.sortButtonText}>
            {capitalize(sortBy)}
          </Text>
          <Text style={styles.sortButtonIcon}>{showSortMenu ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.sortOrderButton}
          onPress={onSortOrderToggle}
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
