import { memo, useState } from 'react';
import { View } from 'react-native';
import { Button, TagGroup } from 'heroui-native';
import type { NFTRarity, NFTType } from '@shared';
import { RARITIES } from '@shared';

interface FilterControlsProps {
  /** Currently active rarity filters. */
  selectedRarities: NFTRarity[];
  /** Currently active type filters. */
  selectedTypes: NFTType[];
  /** Called when the user toggles a rarity chip. */
  onRarityToggle: (rarity: NFTRarity) => void;
  /** Called when the user toggles a type chip. */
  onTypeToggle: (type: NFTType) => void;
  /** Called when the user taps "Clear" to reset all active filters. */
  onClearFilters: () => void;
}

const TYPES: NFTType[] = ['cruise-seat', 'turbo-flush', 'zen-fortress'];

const RARITY_LABELS: Record<NFTRarity, string> = {
  'common': 'Com',
  'rare': 'Rare',
  'legendary': 'Leg',
  'transcendent': 'Trans',
};

const TYPE_LABELS: Record<NFTType, string> = {
  'cruise-seat': 'Cruise',
  'turbo-flush': 'Turbo',
  'zen-fortress': 'Zen',
};

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
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = selectedRarities.length > 0 || selectedTypes.length > 0;
  const activeFilterCount = selectedRarities.length + selectedTypes.length;

  const handleRaritySelectionChange = (newKeys: Set<NFTRarity>) => {
    const prev = new Set(selectedRarities);
    for (const key of newKeys) {
      if (!prev.has(key)) onRarityToggle(key);
    }
    for (const key of prev) {
      if (!newKeys.has(key)) onRarityToggle(key);
    }
  };

  const handleTypeSelectionChange = (newKeys: Set<NFTType>) => {
    const prev = new Set(selectedTypes);
    for (const key of newKeys) {
      if (!prev.has(key)) onTypeToggle(key);
    }
    for (const key of prev) {
      if (!newKeys.has(key)) onTypeToggle(key);
    }
  };

  return (
    <View className="px-4 pb-2">
      <View className="flex-row items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="sm"
          onPress={() => setShowFilters(!showFilters)}
          accessibilityLabel="Toggle filters"
        >
          <Button.Label>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</Button.Label>
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onPress={onClearFilters}
            accessibilityLabel="Clear all filters"
          >
            <Button.Label>Clear All</Button.Label>
          </Button>
        )}
      </View>

      {showFilters && (
        <View className="gap-3">
          {/* Rarity Filters */}
          <TagGroup
            selectionMode="multiple"
            selectedKeys={new Set(selectedRarities)}
            onSelectionChange={(keys) => handleRaritySelectionChange(keys as Set<NFTRarity>)}
            size="sm"
          >
            <TagGroup.List className="flex-row flex-wrap gap-2">
              {RARITIES.map((rarity) => (
                <TagGroup.Item key={rarity} id={rarity}>
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
            <TagGroup.List className="flex-row flex-wrap gap-2">
              {TYPES.map((type) => (
                <TagGroup.Item key={type} id={type}>
                  <TagGroup.ItemLabel>{TYPE_LABELS[type]}</TagGroup.ItemLabel>
                </TagGroup.Item>
              ))}
            </TagGroup.List>
          </TagGroup>
        </View>
      )}
    </View>
  );
}

export default memo(FilterControls);
