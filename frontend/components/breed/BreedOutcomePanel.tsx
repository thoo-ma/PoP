import { View, Text } from 'react-native'
import { Card } from 'heroui-native'
import type { NFTRarity } from '@pop/shared'
import { RARITY_COLORS } from '@/constants'
import { RARITIES } from '@pop/shared'
import { getProbabilities } from '@/utils'

/**
 * Read-only panel that displays the possible rarity outcomes and their
 * percentage probabilities for a given pair of parent rarities.
 * Zero-probability outcomes are hidden automatically.
 */
export default function BreedOutcomePanel({ r1, r2 }: { r1: NFTRarity; r2: NFTRarity }) {
  const probs = getProbabilities(r1, r2)
  return (
    <Card className="w-full mb-5">
      <Card.Body className="p-4">
        <Card.Title className="text-[13px] font-bold uppercase tracking-widest mb-3">
          Possible outcomes
        </Card.Title>
        {RARITIES.map((rarity, i) => {
          const pct = probs[i]
          if (pct === 0) return null
          return (
            <View key={rarity} className="flex-row items-center mb-2 gap-2">
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: RARITY_COLORS[rarity] }}
              />
              <Text className="text-[13px] text-foreground font-semibold w-[90px]">
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </Text>
              <View className="flex-1 h-2 bg-default-100 rounded overflow-hidden">
                <View
                  className="h-full rounded"
                  style={{ width: `${pct}%`, backgroundColor: RARITY_COLORS[rarity] }}
                />
              </View>
              <Text className="text-sm font-bold text-default-600 w-11 text-right">{pct}%</Text>
            </View>
          )
        })}
      </Card.Body>
    </Card>
  )
}
