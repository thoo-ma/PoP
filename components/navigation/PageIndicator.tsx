import { View } from 'react-native';
import { styles } from '../../styles/PageIndicator.styles';

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
}

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
