import { MaterialIcons } from '@expo/vector-icons'
import { Button } from 'heroui-native'
import { memo } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { pageIndicator } from '@/styles'
import type { PageIndicatorProps } from '@/types'

// Define icons for primary pages only
const PRIMARY_PAGE_ICONS = [
  { index: 0, icon: 'home' as const, label: 'Home' },
  { index: 1, icon: 'account-balance-wallet' as const, label: 'Vault' },
  { index: 2, icon: 'sync' as const, label: 'Breed' },
  { index: 3, icon: 'shopping-cart' as const, label: 'Market' },
  { index: 4, icon: 'construction' as const, label: 'Repair' },
]

/**
 * Bottom navigation bar showing icon buttons for the five primary pages and
 * a "More" button that opens the secondary-page menu.
 * Primary page icons are hardcoded to indices 0–4; the More button targets
 * the remaining pages dynamically.
 */
export default memo(function PageIndicator({
  totalPages: _totalPages,
  currentPage,
  onPageChange,
}: PageIndicatorProps) {
  const [active, inactive] = useCSSVariable([
    '--color-on-surface',
    '--color-on-surface-variant',
  ]) as [string, string]
  const s = pageIndicator()
  return (
    <View className={s.wrapper()}>
      <View className={s.rail()}>
        {PRIMARY_PAGE_ICONS.map(({ index, icon, label }) => (
          <Button
            key={index}
            variant="ghost"
            onPress={() => onPageChange?.(index)}
            className={s.navButton()}
            accessibilityLabel={label}
            accessibilityState={{ selected: currentPage === index }}
          >
            <View className={s.iconContainer()}>
              <MaterialIcons
                name={icon}
                size={26}
                color={currentPage === index ? active : inactive}
              />
              <Text
                className={pageIndicator({ active: currentPage === index }).navLabel()}
                style={{ color: currentPage === index ? active : inactive }}
              >
                {label}
              </Text>
            </View>
          </Button>
        ))}
      </View>
    </View>
  )
})
