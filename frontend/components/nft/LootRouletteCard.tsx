import { memo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRollLoot } from '@/hooks';
import type { RollLootResult } from '@/hooks';
import { styles } from '@/styles/nft/LootRouletteCard.styles';

const MAX_HOLDS = 3;
const BASE_CHANCE = 10;
const CHANCE_PER_HOLD = 10;

export interface LootRouletteCardProps {
  lootRollId: string;
  onDone: () => void;
}

/**
 * LootRouletteCard — simple loot roulette UI shown after a successful NFT use.
 *
 * The user can hold up to 3 times (each hold adds +10% loot chance) then roll.
 * All probability logic runs server-side in the `roll-loot` edge function.
 *
 * A Reanimated spinning wheel will replace this card in a future iteration.
 */
export default memo(function LootRouletteCard({ lootRollId, onDone }: LootRouletteCardProps) {
  const { holdLootRoll, rollLoot, loading } = useRollLoot();
  const [holds, setHolds] = useState(0);
  const [result, setResult] = useState<RollLootResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const lootChance = BASE_CHANCE + holds * CHANCE_PER_HOLD;
  const canHold = holds < MAX_HOLDS && !result;
  const canRoll = !result;

  const handleHold = async () => {
    setErr(null);
    const res = await holdLootRoll(lootRollId);
    if (res) {
      setHolds(res.holds);
    } else {
      setErr('Hold failed. Try rolling instead.');
    }
  };

  const handleRoll = async () => {
    setErr(null);
    const res = await rollLoot(lootRollId);
    if (res) {
      setResult(res);
    } else {
      setErr('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎰 Loot Roll</Text>

      {!result ? (
        <>
          <Text style={styles.chanceLabel}>
            Loot Chance: <Text style={styles.chanceValue}>{lootChance}%</Text>
          </Text>

          {holds > 0 && (
            <Text style={styles.holdsBadge}>
              {holds} hold{holds > 1 ? 's' : ''} (+{holds * CHANCE_PER_HOLD}% bonus)
            </Text>
          )}

          {holds === MAX_HOLDS && (
            <Text style={styles.maxHoldNotice}>Max holds reached — now roll!</Text>
          )}

          {err && <Text style={styles.errorText}>{err}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.holdButton, (!canHold || loading) && styles.buttonDisabled]}
              onPress={handleHold}
              disabled={!canHold || loading}
              activeOpacity={0.75}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.holdButtonText}>Hold +{CHANCE_PER_HOLD}%</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rollButton, (!canRoll || loading) && styles.buttonDisabled]}
              onPress={handleRoll}
              disabled={!canRoll || loading}
              activeOpacity={0.75}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.rollButtonText}>Roll!</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {result.won ? (
            <View style={styles.winBox}>
              <Text style={styles.winTitle}>🎁 You won!</Text>
              <Text style={styles.winSub}>A Common Mystery Box has been added to your Vault.</Text>
            </View>
          ) : (
            <View style={styles.lossBox}>
              <Text style={styles.lossTitle}>No luck this time</Text>
              <Text style={styles.lossSub}>Better luck on your next flush!</Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneButton} onPress={onDone} activeOpacity={0.75}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
});

