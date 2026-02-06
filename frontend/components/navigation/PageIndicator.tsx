import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { PageIndicatorProps } from '../../types';
import { styles } from '../../styles/PageIndicator.styles';

// Define icons for each page
const PAGE_ICONS = [
  'home',              // Home
  'event-seat',        // Proof of Immobility
  'water-drop',        // Proof of Flush
  'park',              // Proof of Poop
  'history',           // Detection History
  'account-balance-wallet', // Vault
  'sync',              // Breed
] as const;

export default function PageIndicator({ totalPages, currentPage, onPageChange }: PageIndicatorProps) {
  return (
    <View style={styles.pagination}>
      <View style={styles.floatingMenu}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.iconWrapper}
            onPress={() => onPageChange?.(index)}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name={PAGE_ICONS[index]}
              size={24}
              color={currentPage === index ? '#000' : '#d1d5db'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
