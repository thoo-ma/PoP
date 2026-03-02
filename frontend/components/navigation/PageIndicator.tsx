import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import type { PageIndicatorProps } from '@/types';
import { styles } from '@/styles/navigation/PageIndicator.styles';
import { colors } from '@/constants';

// Define icons for primary pages only
const PRIMARY_PAGE_ICONS = [
  { index: 0, icon: 'home' as const, label: 'Home' },
  { index: 1, icon: 'account-balance-wallet' as const, label: 'Vault' },
  { index: 2, icon: 'sync' as const, label: 'Breed' },
  { index: 3, icon: 'shopping-cart' as const, label: 'Market' },
  { index: 4, icon: 'construction' as const, label: 'Repair' },
];

/**
 * Bottom navigation bar showing icon buttons for the five primary pages and
 * a "More" button that opens the secondary-page menu.
 * Primary page icons are hardcoded to indices 0–4; the More button targets
 * the remaining pages dynamically.
 */
export default memo(function PageIndicator({ totalPages, currentPage, onPageChange }: PageIndicatorProps) {
  return (
    <View style={styles.pagination}>
      <View style={styles.floatingMenu}>
        {PRIMARY_PAGE_ICONS.map(({ index, icon, label }) => (
          <TouchableOpacity
            key={index}
            style={styles.iconWrapper}
            onPress={() => onPageChange?.(index)}
            activeOpacity={0.6}
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={{ selected: currentPage === index }}
          >
            <MaterialIcons
              name={icon}
              size={26}
              color={currentPage === index ? colors.active : colors.inactive}
            />
            <Text style={[styles.iconLabel, currentPage === index && styles.iconLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});
