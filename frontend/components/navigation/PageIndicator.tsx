import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import type { PageIndicatorProps } from '@/types';
import { colors } from '@/constants';
import { Button } from 'heroui-native';

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
    <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0 }} className="flex-row justify-center items-center">
      <View
        className="flex-row bg-[rgba(255,255,255,0.95)] rounded-[24px] px-4 py-[10px] gap-1"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}
      >
        {PRIMARY_PAGE_ICONS.map(({ index, icon, label }) => (
          <View key={index} className="items-center px-[10px] py-1">
            <Button
              isIconOnly
              variant="ghost"
              onPress={() => onPageChange?.(index)}
              accessibilityLabel={label}
              accessibilityState={{ selected: currentPage === index }}
            >
              <MaterialIcons
                name={icon}
                size={26}
                color={currentPage === index ? colors.active : colors.inactive}
              />
            </Button>
            <Text
              className="text-[10px] font-medium mt-1"
              style={{ color: currentPage === index ? colors.active : colors.inactive }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
