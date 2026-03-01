import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@/styles/nft/NFTSelector.styles';

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
    <View style={[styles.selectorRow, style]}>
      <TouchableOpacity
        onPress={onPrev}
        style={styles.selectorArrow}
        accessibilityLabel="Previous NFT"
      >
        <Text style={styles.selectorArrowText}>{'‹'}</Text>
      </TouchableOpacity>
      <Text style={styles.selectorCounter}>
        {current} / {total}
      </Text>
      <TouchableOpacity
        onPress={onNext}
        style={styles.selectorArrow}
        accessibilityLabel="Next NFT"
      >
        <Text style={styles.selectorArrowText}>{'›'}</Text>
      </TouchableOpacity>
    </View>
  );
}
