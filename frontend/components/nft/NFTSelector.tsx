import { View, Text } from 'react-native';
import { Button } from 'heroui-native';

interface Props {
  /** 1-based index of the currently displayed NFT. */
  current: number;
  /** Total number of NFTs in the collection. */
  total: number;
  /** Called when the user taps the left arrow. */
  onPrev: () => void;
  /** Called when the user taps the right arrow. */
  onNext: () => void;
  /** Optional style override for the outer row container. */
  style?: object;
}

/**
 * Prev / Next arrow navigator for cycling through an NFT collection.
 * Renders `null` when `total` is 1 or less (nothing to navigate).
 */
export default function NFTSelector({ current, total, onPrev, onNext, style }: Props) {
  if (total <= 1) return null;

  return (
    <View className="flex-row items-center justify-center gap-4" style={style}>
      <Button
        isIconOnly
        variant="ghost"
        onPress={onPrev}
        accessibilityLabel="Previous NFT"
      >
        <Button.Label className="text-[22px] leading-7 text-text-title">{'‹'}</Button.Label>
      </Button>
      <Text className="text-sm text-text-body font-medium min-w-12 text-center">
        {current} / {total}
      </Text>
      <Button
        isIconOnly
        variant="ghost"
        onPress={onNext}
        accessibilityLabel="Next NFT"
      >
        <Button.Label className="text-[22px] leading-7 text-text-title">{'›'}</Button.Label>
      </Button>
    </View>
  );
}
