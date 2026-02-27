import { View, Text } from 'react-native';
import type { NFTRarity } from '@shared';
import { breedStyles as styles } from '@/styles';
import { RARITY_COLORS } from '@/constants';
import { RARITIES } from '@shared';
import { getProbabilities } from '@/utils';

export default function BreedOutcomePanel({ r1, r2 }: { r1: NFTRarity; r2: NFTRarity }) {
  const probs = getProbabilities(r1, r2);
  return (
    <View style={styles.outcomePanel}>
      <Text style={styles.outcomePanelTitle}>Possible outcomes</Text>
      {RARITIES.map((rarity, i) => {
        const pct = probs[i];
        if (pct === 0) return null;
        return (
          <View key={rarity} style={styles.outcomeRow}>
            <View style={[styles.outcomeColorDot, { backgroundColor: RARITY_COLORS[rarity] }]} />
            <Text style={styles.outcomeRarityLabel}>
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </Text>
            <View style={styles.outcomeBarTrack}>
              <View
                style={[
                  styles.outcomeBarFill,
                  { width: `${pct}%`, backgroundColor: RARITY_COLORS[rarity] },
                ]}
              />
            </View>
            <Text style={styles.outcomePct}>{pct}%</Text>
          </View>
        );
      })}
    </View>
  );
}
