import { Button, cn, Dialog, Slider } from 'heroui-native'
import { memo, useCallback, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import type { AllocateResult, StatDeltas } from '@/hooks'
import { useAllocateStatPoints } from '@/hooks'
import { statModal, tactileButton, tactileButtonText } from '@/styles'
import type { NFT } from '@/types/nft'
import { formatDisplayName } from '@/utils'

const STAT_KEYS = ['efficiency', 'resilience', 'comfort', 'luck'] as const
type StatKey = (typeof STAT_KEYS)[number]

const STAT_LABELS: Record<StatKey, string> = {
  efficiency: 'Efficiency',
  resilience: 'Resilience',
  comfort: 'Comfort',
  luck: 'Luck',
}

export interface StatAllocationModalProps {
  visible: boolean
  nft: NFT
  /** Total unspent stat points currently on this NFT (including newly earned ones). */
  pointsAvailable: number
  /** Called after a successful allocation with the updated stat values. */
  onComplete: (result: AllocateResult) => void
  /** Called when the user taps "Later" — points remain banked. */
  onDismiss: () => void
}

const ZERO_DELTAS: StatDeltas = { efficiency: 0, resilience: 0, comfort: 0, luck: 0 }

export default memo(function StatAllocationModal({
  visible,
  nft,
  pointsAvailable,
  onComplete,
  onDismiss,
}: StatAllocationModalProps) {
  const { allocate, loading, error } = useAllocateStatPoints()
  const [deltas, setDeltas] = useState<StatDeltas>(ZERO_DELTAS)

  const totalSpent = deltas.efficiency + deltas.resilience + deltas.comfort + deltas.luck
  const remaining = pointsAvailable - totalSpent

  const handleSliderChange = useCallback(
    (key: StatKey, newValue: number | number[]) => {
      const value = Array.isArray(newValue) ? newValue[0] : newValue
      const current = nft[key] ?? 0
      const newDelta = Math.max(0, value - current)
      setDeltas((prev) => {
        const otherSpent = prev.efficiency + prev.resilience + prev.comfort + prev.luck - prev[key]
        const capped = Math.min(newDelta, pointsAvailable - otherSpent)
        return { ...prev, [key]: capped }
      })
    },
    [nft, pointsAvailable],
  )

  const handleConfirm = useCallback(async () => {
    if (totalSpent === 0 || loading) return
    const result = await allocate(nft.id, deltas)
    if (result) {
      setDeltas(ZERO_DELTAS)
      onComplete(result)
    }
  }, [allocate, nft.id, deltas, totalSpent, loading, onComplete])

  const handleDismiss = useCallback(() => {
    setDeltas(ZERO_DELTAS)
    onDismiss()
  }, [onDismiss])

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
  )

  const s = statModal()
  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) handleDismiss()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className={s.content()}>
          <View className={s.header()}>
            <Dialog.Title className={s.title()}>Level Up!</Dialog.Title>
            <Dialog.Close variant="ghost" />
          </View>

          <Dialog.Description className={s.description()}>
            Allocate stat points for <Text className="italic">{formatDisplayName(nft.name)}</Text>
          </Dialog.Description>

          {/* Points remaining */}
          <View className={s.pointsBox()}>
            <Text className={s.pointsLabel()}>Points remaining</Text>
            <Text className={s.pointsValue()}>{remaining}</Text>
          </View>

          {/* Stat sliders */}
          {rows.map(({ key, label, current, delta, sliderMax }) => (
            <View key={key} className={s.sliderRow()}>
              <View className={s.sliderHeader()}>
                <Text className={s.statLabel()}>{label}</Text>
                <Text className={s.statValue()}>
                  {current}
                  {delta > 0 ? `+${delta}` : ''}
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

          {error && <Text className={s.errorText()}>{error}</Text>}

          <View className={s.buttonRow()}>
            <Button
              animation="disable-all"
              onPress={handleDismiss}
              isDisabled={loading}
              className={cn(tactileButton({ variant: 'outline' }), 'flex-1')}
            >
              <Button.Label className={tactileButtonText({ variant: 'outline' })}>
                Later
              </Button.Label>
            </Button>
            <Button
              variant="ghost"
              feedbackVariant="none"
              onPress={handleConfirm}
              isDisabled={totalSpent === 0 || loading}
              className={cn(tactileButton({ variant: 'primary' }), 'flex-1')}
            >
              <Button.Label className={tactileButtonText({ variant: 'primary' })}>
                {loading ? 'Saving…' : `Confirm (+${totalSpent} pts)`}
              </Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
})
