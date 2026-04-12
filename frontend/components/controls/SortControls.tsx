import { memo } from 'react'
import type { SortOption } from '@/types'
import SortToolbar from './SortToolbar'

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
  return (
    <SortToolbar
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortByChange={onSortByChange}
      onSortOrderToggle={onSortOrderToggle}
    />
  )
}

export default memo(SortControls)
