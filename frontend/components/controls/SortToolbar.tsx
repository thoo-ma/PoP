import { Select } from 'heroui-native'
import { memo } from 'react'
import { View } from 'react-native'
import { SORT_OPTIONS } from '@/constants'
import { sortControls } from '@/styles'
import type { SortOption } from '@/types'
import { capitalize } from '@/utils'
import TactileButton from '../shared/TactileButton'

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
  return (
    <View className={className ?? s.root()}>
      <View className={s.selectWrapper()}>
        <Select
          value={{ value: sortBy, label: capitalize(sortBy) }}
          onValueChange={(opt) => {
            if (opt && !Array.isArray(opt)) onSortByChange(opt.value as SortOption)
          }}
        >
          <Select.Trigger className="border-[2px] border-outline border-b-[3px] rounded-full">
            <Select.Value className="font-bold" placeholder="Sort by..." />
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

      <TactileButton
        variant="secondary"
        size="sm"
        onPress={onSortOrderToggle}
        accessibilityLabel={`Sort order: ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
      >
        {sortOrder === 'desc' ? '↓' : '↑'}
      </TactileButton>
    </View>
  )
}

export default memo(SortToolbar)
