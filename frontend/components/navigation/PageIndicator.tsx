import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { PageIndicatorProps } from '../../types';
import { styles } from '../../styles/PageIndicator.styles';
import MoreMenu from './MoreMenu';
import { colors } from '../../constants';

// Define icons for primary pages only
const PRIMARY_PAGE_ICONS = [
  { index: 0, icon: 'home' },              // Poop
  { index: 1, icon: 'account-balance-wallet' }, // Vault
  { index: 2, icon: 'sync' },              // Breed
  { index: 3, icon: 'shopping-cart' },     // Marketplace
  { index: 4, icon: 'construction' },      // Repair
] as const;

export default function PageIndicator({ totalPages, currentPage, onPageChange }: PageIndicatorProps) {
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  return (
    <>
      <View style={styles.pagination}>
        <View style={styles.floatingMenu}>
          {PRIMARY_PAGE_ICONS.map(({ index, icon }) => (
            <TouchableOpacity 
              key={index} 
              style={styles.iconWrapper}
              onPress={() => onPageChange?.(index)}
              activeOpacity={0.6}
            >
              <MaterialIcons
                name={icon}
                size={24}
                color={currentPage === index ? '#000' : '#d1d5db'}
              />
            </TouchableOpacity>
          ))}
          
          {/* More button */}
          <TouchableOpacity 
            style={styles.iconWrapper}
            onPress={() => setMoreMenuVisible(true)}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name="more-horiz"
              size={24}
              color={[5, 6, 7, 8].includes(currentPage) ? colors.active : colors.inactive}
            />
          </TouchableOpacity>
        </View>
      </View>

      <MoreMenu
        visible={moreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onSelectPage={onPageChange || (() => {})}
        currentPage={currentPage}
      />
    </>
  );
}
