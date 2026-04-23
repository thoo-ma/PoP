import { memo } from 'react'
import { View } from 'react-native'
import { Button, Select } from '@/components/ui'
import { SORT_OPTIONS } from '@/constants'
import { sortControls, tactileSelect } from '@/styles'
import type { SortOption } from '@/types'
import { capitalize } from '@/utils'

interface SortToolbarProps {
  /** The field currently used for sorting. */
  sortBy: SortOption
  /** Current sort direction. */
  sortOrder: 'asc' | 'desc'
  /** Called when the user picks a new sort field. */
  onSortByChange: (option: SortOption) => void
  /** Called when the user toggles the sort direction. */
  onSortOrderToggle: () => void
  /** Optional className override for the wrapper View. */
  className?: string
}

/**
 * Shared sort row: a field-selector dropdown and an asc/desc direction toggle.
 * Used by both FilterControls (inside a larger toolbar) and SortControls
 * (standalone sort-only bar).
 */
function SortToolbar({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderToggle,
  className,
}: SortToolbarProps) {
  const s = sortControls()
  const sel = tactileSelect()
  return (
    <View className={className ?? s.root()}>
      <View className={s.selectWrapper()}>
        <Select
          value={{ value: sortBy, label: capitalize(sortBy) }}
          onValueChange={(opt) => {
            if (opt && !Array.isArray(opt)) onSortByChange(opt.value as SortOption)
          }}
        >
          <Select.Trigger className={sel.trigger()}>
            <Select.Value className={sel.value()} placeholder="Sort by..." />
            <Select.TriggerIndicator className={sel.indicator()} />
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay />
            <Select.Content presentation="popover" width="trigger" className={sel.content()}>
              {(SORT_OPTIONS as readonly SortOption[]).map((option) => (
                <Select.Item
                  key={option}
                  value={option}
                  label={capitalize(option)}
                  className={sel.item()}
                />
              ))}
            </Select.Content>
          </Select.Portal>
        </Select>
      </View>

      <Button
        variant="secondary"
        size="sm"
        onPress={onSortOrderToggle}
        accessibilityLabel={`Sort order: ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
      >
        <Button.Label>{sortOrder === 'desc' ? '↓' : '↑'}</Button.Label>
      </Button>
    </View>
  )
}

export default memo(SortToolbar)
