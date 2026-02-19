import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/nft/NFTSelector.styles';

interface Props {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  style?: object;
}

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
