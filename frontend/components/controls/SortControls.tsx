import { Button, Select } from 'heroui-native'
import { memo } from 'react'
import { View } from 'react-native'
import { SORT_OPTIONS } from '@/constants'
import { sortControls } from '@/styles'
import type { SortOption } from '@/types'
import { capitalize } from '@/utils'

interface SortControlsProps {
  /** The field currently used for sorting. */
  sortBy: SortOption
  /** Current sort direction. */
  sortOrder: 'asc' | 'desc'
  /** Called when the user picks a new sort field. */
  onSortByChange: (option: SortOption) => void
  /** Called when the user toggles the sort direction. */
  onSortOrderToggle: () => void
}

/**
 * Sort control bar with a field-selector dropdown and an asc/desc toggle.
 */
function SortControls({ sortBy, sortOrder, onSortByChange, onSortOrderToggle }: SortControlsProps) {
  const s = sortControls()
  return (
    <View className={s.root()}>
      <View className={s.selectWrapper()}>
        <Select
          value={{ value: sortBy, label: capitalize(sortBy) }}
          onValueChange={(opt) => {
            if (opt && !Array.isArray(opt)) onSortByChange(opt.value as SortOption)
          }}
        >
          <Select.Trigger>
            <Select.Value placeholder="Sort by..." />
            <Select.TriggerIndicator />
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay />
            <Select.Content presentation="popover" width="trigger">
              {(SORT_OPTIONS as readonly SortOption[]).map((option) => (
                <Select.Item key={option} value={option} label={capitalize(option)} />
              ))}
            </Select.Content>
          </Select.Portal>
        </Select>
      </View>

      <Button
        variant="outline"
        size="sm"
        isIconOnly
        onPress={onSortOrderToggle}
        accessibilityLabel={`Sort order: ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
      >
        <Button.Label>{sortOrder === 'desc' ? '↓' : '↑'}</Button.Label>
      </Button>
    </View>
  )
}

export default memo(SortControls)
