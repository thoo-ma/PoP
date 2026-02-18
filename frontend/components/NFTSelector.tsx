import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  selectorArrow: {
    width: 52,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectorArrowText: {
    fontSize: 22,
    lineHeight: 28,
    color: '#374151',
    fontWeight: '400',
  },
  selectorCounter: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    minWidth: 48,
    textAlign: 'center',
  },
});
