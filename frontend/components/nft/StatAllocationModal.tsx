import { memo, useState, useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import { Button, Dialog, Slider } from "heroui-native";
import type { NFT } from "@/types/nft";
import { formatDisplayName } from "@/utils";
import { useAllocateStatPoints } from "@/hooks";
import type { StatDeltas, AllocateResult } from "@/hooks";

const STAT_KEYS = ["efficiency", "resilience", "comfort", "luck"] as const;
type StatKey = (typeof STAT_KEYS)[number];

const STAT_LABELS: Record<StatKey, string> = {
  efficiency: "Efficiency",
  resilience: "Resilience",
  comfort: "Comfort",
  luck: "Luck",
};

export interface StatAllocationModalProps {
  visible: boolean;
  nft: NFT;
  /** Total unspent stat points currently on this NFT (including newly earned ones). */
  pointsAvailable: number;
  /** Called after a successful allocation with the updated stat values. */
  onComplete: (result: AllocateResult) => void;
  /** Called when the user taps "Later" — points remain banked. */
  onDismiss: () => void;
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
  const remaining = pointsAvailable - totalSpent;

  const handleSliderChange = useCallback(
    (key: StatKey, newValue: number | number[]) => {
      const value = Array.isArray(newValue) ? newValue[0] : newValue;
      const current = nft[key] ?? 0;
      const newDelta = Math.max(0, value - current);
      setDeltas((prev) => {
        const otherSpent = prev.efficiency + prev.resilience + prev.comfort + prev.luck - prev[key];
        const capped = Math.min(newDelta, pointsAvailable - otherSpent);
        return { ...prev, [key]: capped };
      });
    },
    [nft, pointsAvailable],
  );

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

  const rows = useMemo(
    () =>
      STAT_KEYS.map((key) => ({
        key,
        label: STAT_LABELS[key],
        current: nft[key] ?? 0,
        delta: deltas[key],
        sliderMax: Math.min(100, (nft[key] ?? 0) + remaining + deltas[key]),
      })),
    [nft, deltas, remaining],
  );

  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) handleDismiss();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="px-6 pt-5 pb-10 rounded-t-3xl">
          <View className="flex-row items-center justify-between mb-1">
            <Dialog.Title className="text-lg font-bold text-foreground">🎉 Level Up!</Dialog.Title>
            <Dialog.Close variant="ghost" />
          </View>

          <Dialog.Description className="text-sm text-muted mb-5">
            Allocate stat points for <Text className="italic">{formatDisplayName(nft.name)}</Text>
          </Dialog.Description>

          {/* Points remaining */}
          <View className="flex-row items-center justify-between bg-default rounded-xl py-2.5 px-4 mb-5">
            <Text className="text-sm font-semibold text-muted">Points remaining</Text>
            <Text className="text-2xl font-extrabold text-foreground">{remaining}</Text>
          </View>

          {/* Stat sliders */}
          {rows.map(({ key, label, current, delta, sliderMax }) => (
            <View key={key} className="mb-4">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm font-semibold text-muted">{label}</Text>
                <Text className="text-sm font-bold text-foreground">
                  {current}
                  {delta > 0 ? `+${delta}` : ""}
                </Text>
              </View>
              <Slider
                minValue={current}
                maxValue={sliderMax}
                value={current + delta}
                onChange={(v) => handleSliderChange(key, v)}
                isDisabled={sliderMax <= current}
              >
                <Slider.Track>
                  <Slider.Fill />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider>
            </View>
          ))}

          {error && <Text className="text-sm text-danger text-center mb-2">{error}</Text>}

          <View className="flex-row gap-3 mt-2">
            <Button variant="ghost" className="flex-1" onPress={handleDismiss} isDisabled={loading}>
              <Button.Label>Later</Button.Label>
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onPress={handleConfirm}
              isDisabled={totalSpent === 0 || loading}
            >
              <Button.Label>{loading ? "Saving…" : `Confirm (+${totalSpent} pts)`}</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
});
