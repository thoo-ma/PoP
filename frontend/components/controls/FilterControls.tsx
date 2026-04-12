import type { NFTRarity, NFTType } from '@pop/shared'
import { RARITIES } from '@pop/shared'
import { Button, Select, TagGroup } from 'heroui-native'
import { memo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { SORT_OPTIONS } from '@/constants'
import { filterControls, tactileButton, tactileButtonText } from '@/styles'
import type { SortOption } from '@/types'
import { capitalize } from '@/utils'

interface FilterControlsProps {
  /** Currently active rarity filters. */
  selectedRarities: NFTRarity[]
  /** Currently active type filters. */
  selectedTypes: NFTType[]
  /** Called when the user toggles a rarity chip. */
  onRarityToggle: (rarity: NFTRarity) => void
  /** Called when the user toggles a type chip. */
  onTypeToggle: (type: NFTType) => void
  /** Called when the user taps "Clear" to reset all active filters. */
  onClearFilters: () => void
  /** The field currently used for sorting. */
  sortBy: SortOption
  /** Current sort direction. */
  sortOrder: 'asc' | 'desc'
  /** Called when the user picks a new sort field. */
  onSortByChange: (option: SortOption) => void
  /** Called when the user toggles the sort direction. */
  onSortOrderToggle: () => void
}

const TYPES: NFTType[] = ['cruise-seat', 'turbo-flush', 'zen-fortress']

const RARITY_LABELS: Record<NFTRarity, string> = {
  common: 'Com',
  rare: 'Rare',
  legendary: 'Leg',
  transcendent: 'Trans',
}

const TYPE_LABELS: Record<NFTType, string> = {
  'cruise-seat': 'Cruise',
  'turbo-flush': 'Turbo',
  'zen-fortress': 'Zen',
}

/**
 * Filter chip bar for narrowing an NFT collection by rarity and type.
 * Renders a "Clear" button when any filter is active.
 */
function FilterControls({
  selectedRarities,
  selectedTypes,
  onRarityToggle,
  onTypeToggle,
  onClearFilters,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderToggle,
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false)
  const hasActiveFilters = selectedRarities.length > 0 || selectedTypes.length > 0
  const activeFilterCount = selectedRarities.length + selectedTypes.length
  const s = filterControls()

  const handleRaritySelectionChange = (newKeys: Set<NFTRarity>) => {
    const prev = new Set(selectedRarities)
    for (const key of newKeys) {
      if (!prev.has(key)) onRarityToggle(key)
    }
    for (const key of prev) {
      if (!newKeys.has(key)) onRarityToggle(key)
    }
  }

  const handleTypeSelectionChange = (newKeys: Set<NFTType>) => {
    const prev = new Set(selectedTypes)
    for (const key of newKeys) {
      if (!prev.has(key)) onTypeToggle(key)
    }
    for (const key of prev) {
      if (!newKeys.has(key)) onTypeToggle(key)
    }
  }

  return (
    <View className={s.root()}>
      {/* Toolbar: [dropdown] [arrow] [Filters btn] */}
      <View className={s.toolbar()}>
        {/* Sort dropdown — flex-1 so it fills remaining space */}
        <View className={s.sortWrapper()}>
          <Select
            value={{ value: sortBy, label: capitalize(sortBy) }}
            onValueChange={(opt) => {
              if (opt && !Array.isArray(opt)) onSortByChange(opt.value as SortOption)
            }}
          >
            <Select.Trigger className="h-[40px] py-0 bg-surface-container-low border-[3px] border-outline border-b-[6px] rounded-full px-4">
              <Select.Value className="font-bold text-on-surface" placeholder="Sort by..." />
              <Select.TriggerIndicator className="text-on-surface" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Overlay />
              <Select.Content
                presentation="popover"
                width="trigger"
                className="bg-surface border-[2px] border-outline rounded-2xl overflow-hidden"
              >
                {(SORT_OPTIONS as readonly SortOption[]).map((option) => (
                  <Select.Item
                    key={option}
                    value={option}
                    label={capitalize(option)}
                    className="px-4 py-2"
                  />
                ))}
              </Select.Content>
            </Select.Portal>
          </Select>
        </View>

        {/* Sort order arrow */}
        <Pressable
          onPress={onSortOrderToggle}
          accessibilityLabel={`Sort order: ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
          className={tactileButton({ variant: 'secondary', size: 'sm' })}
        >
          <Text className="text-on-surface font-black text-base">
            {sortOrder === 'desc' ? '↓' : '↑'}
          </Text>
        </Pressable>

        {/* Filters toggle */}
        <Button
          variant="ghost"
          feedbackVariant="none"
          size="sm"
          onPress={() => setShowFilters(!showFilters)}
          accessibilityLabel="Toggle filters"
          className={tactileButton({ variant: 'secondary', size: 'sm' })}
        >
          <Button.Label className={tactileButtonText({ variant: 'secondary', size: 'sm' })}>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button.Label>
        </Button>
      </View>

      {/* Filter badges */}
      {showFilters && (
        <View className={s.panel()}>
          {/* Rarity Filters */}
          <TagGroup
            selectionMode="multiple"
            selectedKeys={new Set(selectedRarities)}
            onSelectionChange={(keys) => handleRaritySelectionChange(keys as Set<NFTRarity>)}
            size="sm"
          >
            <TagGroup.List className={s.tagList()}>
              {RARITIES.map((rarity) => (
                <TagGroup.Item
                  key={rarity}
                  id={rarity}
                  className="border-[2px] border-outline border-b-[3px] rounded-full"
                >
                  <TagGroup.ItemLabel>{RARITY_LABELS[rarity]}</TagGroup.ItemLabel>
                </TagGroup.Item>
              ))}
            </TagGroup.List>
          </TagGroup>

          {/* Type Filters */}
          <TagGroup
            selectionMode="multiple"
            selectedKeys={new Set(selectedTypes)}
            onSelectionChange={(keys) => handleTypeSelectionChange(keys as Set<NFTType>)}
            size="sm"
          >
            <TagGroup.List className={s.tagList()}>
              {TYPES.map((type) => (
                <TagGroup.Item
                  key={type}
                  id={type}
                  className="border-[2px] border-outline border-b-[3px] rounded-full"
                >
                  <TagGroup.ItemLabel>{TYPE_LABELS[type]}</TagGroup.ItemLabel>
                </TagGroup.Item>
              ))}
            </TagGroup.List>
          </TagGroup>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              feedbackVariant="none"
              size="sm"
              onPress={onClearFilters}
              accessibilityLabel="Clear all filters"
              className={tactileButton({ variant: 'secondary', size: 'sm' })}
            >
              <Button.Label className={tactileButtonText({ variant: 'secondary', size: 'sm' })}>
                Clear All
              </Button.Label>
            </Button>
          )}
        </View>
      )}
    </View>
  )
}

export default memo(FilterControls)
