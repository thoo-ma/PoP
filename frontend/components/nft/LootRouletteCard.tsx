import { BASE_WIN_PROBABILITY, MAX_HOLDS, PER_HOLD_INCREMENT } from '@pop/shared'
import { memo, useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Card, Spinner, useToast } from '@/components/ui'
import type { RollLootResult } from '@/hooks'
import { useRollLoot } from '@/hooks'
import { lootPanel, lootResultPanel } from '@/styles'

const BASE_CHANCE = Math.round(BASE_WIN_PROBABILITY * 100)
const CHANCE_PER_HOLD = Math.round(PER_HOLD_INCREMENT * 100)

export interface LootRouletteCardProps {
  lootRollId: string
  onDone: () => void
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
  const { holdLootRoll, rollLoot, loading } = useRollLoot()
  const { toast } = useToast()
  const [holds, setHolds] = useState(0)
  const [result, setResult] = useState<RollLootResult | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const cardStyles = lootPanel()
  const wonStyles = lootResultPanel({ status: 'won' })
  const lostStyles = lootResultPanel({ status: 'lost' })

  const lootChance = BASE_CHANCE + holds * CHANCE_PER_HOLD
  const canHold = holds < MAX_HOLDS && !result
  const canRoll = !result

  const handleHold = async () => {
    setErr(null)
    const res = await holdLootRoll(lootRollId)
    if (res) {
      setHolds(res.holds)
    } else {
      setErr('Hold failed. Try rolling instead.')
      toast.show({ variant: 'danger', label: 'Hold Failed', description: 'Try rolling instead.' })
    }
  }

  const handleRoll = async () => {
    setErr(null)
    const res = await rollLoot(lootRollId)
    if (res) {
      setResult(res)
    } else {
      setErr('Something went wrong. Please try again.')
      toast.show({
        variant: 'danger',
        label: 'Roll Failed',
        description: 'Something went wrong. Please try again.',
        actionLabel: 'Retry',
        onActionPress: ({ hide }) => {
          hide()
          handleRoll()
        },
      })
    }
  }

  const currentState = result
    ? result.won
      ? 'won'
      : 'lost'
    : holds === MAX_HOLDS
      ? 'max holds reached'
      : 'in progress'

  return (
    <View className={cardStyles.wrapper()}>
      <Card
        className={cardStyles.root()}
        animation="disable-all"
        accessibilityLabel={`Loot roulette, ${lootChance}% chance, ${currentState}`}
      >
        <Card.Body className={cardStyles.body()}>
          <Card.Title className={cardStyles.title()}>Loot Roll</Card.Title>

          {!result ? (
            <>
              <Text className="text-base">
                Loot Chance: <Text className={cardStyles.chanceValue()}>{lootChance}%</Text>
              </Text>

              {holds > 0 && (
                <Text className={cardStyles.holdText()}>
                  {holds} hold{holds > 1 ? 's' : ''} (+{holds * CHANCE_PER_HOLD}% bonus)
                </Text>
              )}

              {holds === MAX_HOLDS && (
                <Text className={cardStyles.maxHoldText()}>Max holds reached — now roll!</Text>
              )}

              {err && <Text className={cardStyles.rollError()}>{err}</Text>}

              <View className={cardStyles.buttonRow()}>
                <Button
                  variant="secondary"
                  onPress={handleHold}
                  isDisabled={!canHold || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Button.Label>{`Hold +${CHANCE_PER_HOLD}%`}</Button.Label>
                  )}
                </Button>

                <Button
                  variant="primary"
                  onPress={handleRoll}
                  isDisabled={!canRoll || loading}
                  className="flex-1"
                >
                  {loading ? <Spinner size="sm" /> : <Button.Label>Roll!</Button.Label>}
                </Button>
              </View>
            </>
          ) : (
            <>
              {result.won ? (
                <View className={wonStyles.root()}>
                  <Text className={wonStyles.title()}>You won!</Text>
                  <Text className={wonStyles.body()}>
                    A Common Mystery Box has been added to your Vault.
                  </Text>
                </View>
              ) : (
                <View className={lostStyles.root()}>
                  <Text className={lostStyles.title()}>No luck this time</Text>
                  <Text className={lostStyles.body()}>Better luck on your next flush!</Text>
                </View>
              )}

              <Button
                animation="disable-all"
                variant="secondary"
                onPress={onDone}
                className="px-8 mt-2"
              >
                <Button.Label>Done</Button.Label>
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </View>
  )
})
