import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import type { NFTRarity, NFTTier } from '@/types';
import { RARITIES } from '@/constants';

interface FilterControlsProps {
  selectedRarities: NFTRarity[];
  selectedTiers: NFTTier[];
  onRarityToggle: (rarity: NFTRarity) => void;
  onTierToggle: (tier: NFTTier) => void;
  onClearFilters: () => void;
  styles: any;
}
const TIERS: NFTTier[] = ['cruise-seat', 'turbo-flush', 'zen-fortress'];

const RARITY_LABELS: Record<NFTRarity, string> = {
  'common': 'Com',
  'rare': 'Rare',
  'legendary': 'Leg',
  'transcendent': 'Trans',
};

const TIER_LABELS: Record<NFTTier, string> = {
  'cruise-seat': 'Cruise',
  'turbo-flush': 'Turbo',
  'zen-fortress': 'Zen',
};

function FilterControls({
  selectedRarities,
  selectedTiers,
  onRarityToggle,
  onTierToggle,
  onClearFilters,
  styles,
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = selectedRarities.length > 0 || selectedTiers.length > 0;
  
  const activeFilterCount = selectedRarities.length + selectedTiers.length;

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

          {/* Tier Filters */}
          <View style={[styles.filterSection, styles.filterSectionLast]}>
            <Text style={styles.filterSectionLabel}>Tier</Text>
            <View style={styles.filterChipsRow}>
              {TIERS.map((tier) => {
                const isSelected = selectedTiers.includes(tier);
                return (
                  <TouchableOpacity
                    key={tier}
                    style={[
                      styles.filterChip,
                      styles[`${tier}Chip`],
                      isSelected && styles.filterChipActive,
                      isSelected && styles[`${tier}ChipActive`],
                    ]}
                    onPress={() => onTierToggle(tier)}
                    accessibilityLabel={`Filter by ${TIER_LABELS[tier]} tier`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text 
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive
                      ]}
                    >
                      {TIER_LABELS[tier]}
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

export default React.memo(FilterControls);
