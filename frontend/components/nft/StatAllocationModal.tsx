import { memo, useState, useCallback, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import type { NFT } from '@/types/nft';
import { colors } from '@/constants';
import { formatDisplayName } from '@/utils';
import { useAllocateStatPoints } from '@/hooks';
import type { StatDeltas, AllocateResult } from '@/hooks';
import { styles } from '@/styles/nft/StatAllocationModal.styles';

const STAT_KEYS = ['efficiency', 'resilience', 'comfort', 'luck'] as const;
type StatKey = typeof STAT_KEYS[number];

const STAT_COLORS: Record<StatKey, string> = {
  efficiency: colors.efficiency,
  resilience: colors.resilience,
  comfort:    colors.comfort,
  luck:       colors.luck,
};

const STAT_LABELS: Record<StatKey, string> = {
  efficiency: 'Efficiency',
  resilience: 'Resilience',
  comfort:    'Comfort',
  luck:       'Luck',
};

export interface StatAllocationModalProps {
  visible:       boolean;
  nft:           NFT;
  /** Total unspent stat points currently on this NFT (including newly earned ones). */
  pointsAvailable: number;
  /** Called after a successful allocation with the updated stat values. */
  onComplete: (result: AllocateResult) => void;
  /** Called when the user taps "Later" — points remain banked. */
  onDismiss:  () => void;
}

const ZERO_DELTAS: StatDeltas = { efficiency: 0, resilience: 0, comfort: 0, luck: 0 };

export default memo(function StatAllocationModal({
  visible,
  nft,
  pointsAvailable,
  onComplete,
  onDismiss,
}: StatAllocationModalProps) {
  const { allocate, loading, error } = useAllocateStatPoints();
  const [deltas, setDeltas] = useState<StatDeltas>(ZERO_DELTAS);

  const totalSpent = deltas.efficiency + deltas.resilience + deltas.comfort + deltas.luck;
  const remaining  = pointsAvailable - totalSpent;

  const increment = useCallback((key: StatKey) => {
    setDeltas(prev => {
      const spent = prev.efficiency + prev.resilience + prev.comfort + prev.luck;
      if (spent >= pointsAvailable) return prev;
      if ((nft[key] ?? 0) + prev[key] >= 100) return prev;
      return { ...prev, [key]: prev[key] + 1 };
    });
  }, [pointsAvailable, nft]);

  const decrement = useCallback((key: StatKey) => {
    setDeltas(prev => {
      if (prev[key] <= 0) return prev;
      return { ...prev, [key]: prev[key] - 1 };
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (totalSpent === 0 || loading) return;
    const result = await allocate(nft.id, deltas);
    if (result) {
      setDeltas(ZERO_DELTAS);
      onComplete(result);
    }
  }, [allocate, nft.id, deltas, totalSpent, loading, onComplete]);

  const handleDismiss = useCallback(() => {
    setDeltas(ZERO_DELTAS);
    onDismiss();
  }, [onDismiss]);

  const rows = useMemo(() => STAT_KEYS.map(key => ({
    key,
    label:    STAT_LABELS[key],
    color:    STAT_COLORS[key],
    current:  nft[key] ?? 0,
    delta:    deltas[key],
    canInc:   remaining > 0 && (nft[key] ?? 0) + deltas[key] < 100,
    canDec:   deltas[key] > 0,
  })), [nft, deltas, remaining]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>🎉 Level Up!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Allocate stat points for{' '}
            <Text style={styles.nftName}>{formatDisplayName(nft.name)}</Text>
          </Text>

          {/* Points remaining */}
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Points remaining</Text>
            <Text style={styles.pointsValue}>{remaining}</Text>
          </View>

          {/* Stat rows */}
          {rows.map(({ key, label, color, current, delta, canInc, canDec }) => (
            <View key={key} style={styles.statRow}>
              <Text style={styles.statLabel}>{label}</Text>

              {/* Progress bar — base fill + pending delta */}
              <View style={styles.barWrapper}>
                <View
                  style={[styles.barFill, { width: `${current}%`, backgroundColor: color }]}
                />
                {delta > 0 && (
                  <View
                    style={[
                      styles.barDelta,
                      {
                        left:            `${current}%`,
                        width:           `${delta}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                )}
              </View>

              <Text style={styles.valueText}>
                {current}{delta > 0 ? `+${delta}` : ''}
              </Text>

              {/* – / delta / + controls */}
              <View style={styles.adjustRow}>
                <TouchableOpacity
                  style={[styles.adjustBtn, !canDec && styles.adjustBtnDisabled]}
                  onPress={() => decrement(key)}
                  disabled={!canDec}
                >
                  <Text style={styles.adjustBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.deltaText}>{delta > 0 ? `+${delta}` : '0'}</Text>
                <TouchableOpacity
                  style={[styles.adjustBtn, !canInc && styles.adjustBtnDisabled]}
                  onPress={() => increment(key)}
                  disabled={!canInc}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.laterButton} onPress={handleDismiss} disabled={loading}>
              <Text style={styles.laterButtonText}>Later</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, (totalSpent === 0 || loading) && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={totalSpent === 0 || loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Saving…' : `Confirm (+${totalSpent} pts)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});
