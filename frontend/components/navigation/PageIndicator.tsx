import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback, memo } from 'react';
import type { PageIndicatorProps } from '@/types';
import { styles } from '@/styles/navigation/PageIndicator.styles';
import MoreMenu from './MoreMenu';
import { colors } from '@/constants';

// Define icons for primary pages only
const PRIMARY_PAGE_ICONS = [
  { index: 0, icon: 'home' as const, label: 'Home' },
  { index: 1, icon: 'account-balance-wallet' as const, label: 'Vault' },
  { index: 2, icon: 'sync' as const, label: 'Breed' },
  { index: 3, icon: 'shopping-cart' as const, label: 'Market' },
  { index: 4, icon: 'construction' as const, label: 'Repair' },
];

export default memo(function PageIndicator({ totalPages, currentPage, onPageChange }: PageIndicatorProps) {
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const handleMorePress = useCallback(() => setMoreMenuVisible(true), []);
  const handleMoreClose = useCallback(() => setMoreMenuVisible(false), []);

  return (
    <>
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
                color={currentPage === index ? '#000' : '#d1d5db'}
              />
              <Text style={[styles.iconLabel, currentPage === index && styles.iconLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* More button */}
          <TouchableOpacity 
            style={styles.iconWrapper}
            onPress={handleMorePress}
            activeOpacity={0.6}
            accessibilityLabel="More pages"
            accessibilityRole="button"
            accessibilityHint="Opens additional navigation options"
          >
            <MaterialIcons
              name="more-horiz"
              size={26}
              color={[5, 6, 7, 8].includes(currentPage) ? colors.active : colors.inactive}
            />
            <Text style={[styles.iconLabel, [5, 6, 7, 8].includes(currentPage) && styles.iconLabelActive]}>
              More
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <MoreMenu
        visible={moreMenuVisible}
        onClose={handleMoreClose}
        onSelectPage={onPageChange || (() => {})}
        currentPage={currentPage}
      />
    </>
  );
});
