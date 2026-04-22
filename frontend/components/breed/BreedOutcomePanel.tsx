import type { NFTRarity } from '@pop/shared'
import { RARITIES } from '@pop/shared'
import { Card } from 'heroui-native'
import { Text, View } from 'react-native'
import { ProgressBar } from '@/components/shared'
import { useRarityColors } from '@/hooks'
import { outcomePanel } from '@/styles'
import { getProbabilities } from '@/utils'

/**
 * Read-only panel that displays the possible rarity outcomes and their
 * percentage probabilities for a given pair of parent rarities.
 * Zero-probability outcomes are hidden automatically.
 */
export default function BreedOutcomePanel({ r1, r2 }: { r1: NFTRarity; r2: NFTRarity }) {
  const probs = getProbabilities(r1, r2)
  const rarityColors = useRarityColors()
  const s = outcomePanel()
  return (
    <View className={s.wrapper()}>
      <Card className={s.root()} animation="disable-all">
        <Card.Body className={s.body()}>
          <Card.Title className={s.title()}>Possible outcomes</Card.Title>
          {RARITIES.map((rarity, i) => {
            const pct = probs[i]
            if (pct === 0) return null
            return (
              <View key={rarity} className={s.row()}>
                <Text className={s.label()}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </Text>
                <ProgressBar value={pct} color={rarityColors[rarity]} />
                <Text className={s.value()}>{pct}%</Text>
              </View>
            )
          })}
        </Card.Body>
      </Card>
    </View>
  )
}
