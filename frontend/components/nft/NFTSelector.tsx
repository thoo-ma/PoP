import { Feather } from '@expo/vector-icons'
import { Button, cn } from 'heroui-native'
import { Text, View } from 'react-native'
import { tv } from 'tailwind-variants'
import { colors } from '@/constants/theme'
import { nftSelectorCounter } from '@/styles'

// ── Design System Recipes ─────────────────────────────────────────────────────

const tactileNavButton = tv({
  base: [
    'w-[48px] h-[48px] rounded-2xl bg-surface',
    'border-2 border-surface-container-highest border-b-[4px]',
    'flex-row items-center justify-center',
    'active:border-b-2 active:translate-y-[2px]',
  ],
})

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  /** 1-based index of the currently displayed NFT. */
  current: number
  /** Total number of NFTs in the collection. */
  total: number
  /** Called when the user taps the left arrow. */
  onPrev: () => void
  /** Called when the user taps the right arrow. */
  onNext: () => void
  /** Optional className for the outer row container. */
  className?: string
}

/**
 * Prev / Next arrow navigator for cycling through an NFT collection.
 * Renders `null` when `total` is 1 or less (nothing to navigate).
 */
export default function NFTSelector({ current, total, onPrev, onNext, className }: Props) {
  if (total <= 1) return null

  return (
    <View className={cn('flex-row items-center justify-center gap-5', className)}>
      <Button
        isIconOnly
        variant="ghost"
        feedbackVariant="none"
        onPress={onPrev}
        className={tactileNavButton()}
        accessibilityLabel="Previous NFT"
      >
        {/* Pass the icon directly as a child */}
        <Feather name="chevron-left" size={24} color={colors.onSurface} />
      </Button>

      <Text className={nftSelectorCounter()}>
        {current} / {total}
      </Text>

      <Button
        isIconOnly
        variant="ghost"
        feedbackVariant="none"
        onPress={onNext}
        className={tactileNavButton()}
        accessibilityLabel="Next NFT"
      >
        {/* Pass the icon directly as a child */}
        <Feather name="chevron-right" size={24} color={colors.onSurface} />
      </Button>
    </View>
  )
}
