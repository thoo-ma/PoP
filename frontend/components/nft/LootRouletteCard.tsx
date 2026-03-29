import { memo, useState } from "react";
import { View, Text } from "react-native";
import { Card, Button, Spinner } from "heroui-native";
import { useRollLoot } from "@/hooks";
import type { RollLootResult } from "@/hooks";

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
      setErr("Hold failed. Try rolling instead.");
    }
  };

  const handleRoll = async () => {
    setErr(null);
    const res = await rollLoot(lootRollId);
    if (res) {
      setResult(res);
    } else {
      setErr("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="mx-4 items-center gap-4" animation="disable-all">
      <Card.Body className="items-center gap-4 w-full">
        <Card.Title className="text-xl font-bold">🎰 Loot Roll</Card.Title>

        {!result ? (
          <>
            <Text className="text-base">
              Loot Chance: <Text className="font-bold text-stat-luck">{lootChance}%</Text>
            </Text>

            {holds > 0 && (
              <Text className="text-sm italic text-stat-efficiency">
                {holds} hold{holds > 1 ? "s" : ""} (+{holds * CHANCE_PER_HOLD}% bonus)
              </Text>
            )}

            {holds === MAX_HOLDS && (
              <Text className="text-sm italic text-stat-comfort">
                Max holds reached — now roll!
              </Text>
            )}

            {err && <Text className="text-sm text-center text-stat-energy">{err}</Text>}

            <View className="flex-row gap-3 w-full mt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onPress={handleHold}
                isDisabled={!canHold || loading}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <Button.Label>Hold +{CHANCE_PER_HOLD}%</Button.Label>
                )}
              </Button>

              <Button
                variant="primary"
                className="flex-1"
                onPress={handleRoll}
                isDisabled={!canRoll || loading}
              >
                {loading ? <Spinner size="sm" /> : <Button.Label>Roll!</Button.Label>}
              </Button>
            </View>
          </>
        ) : (
          <>
            {result.won ? (
              <View className="items-center gap-2 rounded-xl py-4 px-6 w-full bg-green-100">
                <Text className="text-2xl font-extrabold text-emerald-900">🎁 You won!</Text>
                <Text className="text-base text-center text-emerald-900">
                  A Common Mystery Box has been added to your Vault.
                </Text>
              </View>
            ) : (
              <View className="items-center gap-2 rounded-xl py-4 px-6 w-full bg-surface-light">
                <Text className="text-xl font-bold text-text-title">No luck this time</Text>
                <Text className="text-base text-center text-text-body">
                  Better luck on your next flush!
                </Text>
              </View>
            )}

            <Button variant="secondary" className="px-8 mt-2" onPress={onDone}>
              <Button.Label>Done</Button.Label>
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
});
