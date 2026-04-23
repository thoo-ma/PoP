import { Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { Button, cn } from '@/components/ui'
import { nftSelectorCounter, tactileNavButton } from '@/styles'

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
  const onSurface = useCSSVariable('--foreground') as string
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
        <Feather name="chevron-left" size={24} color={onSurface} />
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
        <Feather name="chevron-right" size={24} color={onSurface} />
      </Button>
    </View>
  )
}
