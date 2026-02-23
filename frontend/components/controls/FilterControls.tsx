import { memo, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import type { NFTRarity, NFTType } from '@/types';
import { RARITIES } from '@/constants';

interface FilterControlsProps {
  selectedRarities: NFTRarity[];
  selectedTypes: NFTType[];
  onRarityToggle: (rarity: NFTRarity) => void;
  onTypeToggle: (type: NFTType) => void;
  onClearFilters: () => void;
  styles: any;
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

function FilterControls({
  selectedRarities,
  selectedTypes,
  onRarityToggle,
  onTypeToggle,
  onClearFilters,
  styles,
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = selectedRarities.length > 0 || selectedTypes.length > 0;
  
  const activeFilterCount = selectedRarities.length + selectedTypes.length;

  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterToggleRow}>
        <TouchableOpacity 
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
          accessibilityLabel="Toggle filters"
          accessibilityRole="button"
        >
          <Text style={styles.filterToggleText}>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
          <Text style={styles.filterToggleIcon}>{showFilters ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {hasActiveFilters && (
          <TouchableOpacity 
            onPress={onClearFilters}
            style={styles.clearButton}
            accessibilityLabel="Clear all filters"
            accessibilityRole="button"
          >
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {showFilters && (
        <View style={styles.filterContent}>
          {/* Rarity Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionLabel}>Rarity</Text>
            <View style={styles.filterChipsRow}>
              {RARITIES.map((rarity) => {
                const isSelected = selectedRarities.includes(rarity);
                return (
                  <TouchableOpacity
                    key={rarity}
                    style={[
                      styles.filterChip,
                      styles[`${rarity}Chip`],
                      isSelected && styles.filterChipActive,
                      isSelected && styles[`${rarity}ChipActive`],
                    ]}
                    onPress={() => onRarityToggle(rarity)}
                    accessibilityLabel={`Filter by ${rarity} rarity`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive
                      ]}
                    >
                      {RARITY_LABELS[rarity]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Type Filters */}
          <View style={[styles.filterSection, styles.filterSectionLast]}>
            <Text style={styles.filterSectionLabel}>Type</Text>
            <View style={styles.filterChipsRow}>
              {TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      styles[`${type}Chip`],
                      isSelected && styles.filterChipActive,
                      isSelected && styles[`${type}ChipActive`],
                    ]}
                    onPress={() => onTypeToggle(type)}
                    accessibilityLabel={`Filter by ${TYPE_LABELS[type]} type`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive
                      ]}
                    >
                      {TYPE_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default memo(FilterControls);
