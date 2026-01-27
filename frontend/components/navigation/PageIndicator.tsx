import { View } from 'react-native';
import type { PageIndicatorProps } from '../../types';
import { styles } from '../../styles/PageIndicator.styles';

export default function PageIndicator({ totalPages, currentPage }: PageIndicatorProps) {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentPage === index && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}
