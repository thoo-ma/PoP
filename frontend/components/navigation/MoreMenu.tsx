import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { MoreMenuProps } from '../../types';
import { styles } from '../../styles/MoreMenu.styles';
import { colors } from '../../constants';

const MORE_PAGES = [
  { index: 5, name: 'Proof of Immobility', icon: 'event-seat', hint: 'Test your ability to stay still' },
  { index: 6, name: 'Proof of Flush', icon: 'water-drop', hint: 'Record and verify toilet flush sound' },
  { index: 7, name: 'Proof of Poop', icon: 'park', hint: 'Complete the ultimate immobility and flush challenge' },
  { index: 8, name: 'Detection History', icon: 'history', hint: 'View your past detection attempts' },
];

export default function MoreMenu({ visible, onClose, onSelectPage, currentPage }: MoreMenuProps) {
  const handleSelectPage = (pageIndex: number) => {
    onSelectPage(pageIndex);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>More Pages</Text>
            {MORE_PAGES.map((page) => (
              <TouchableOpacity
                key={page.index}
                style={[
                  styles.menuItem,
                  currentPage === page.index && styles.menuItemActive
                ]}
                onPress={() => handleSelectPage(page.index)}
                accessibilityLabel={page.name}
                accessibilityRole="button"
                accessibilityHint={page.hint}
                accessibilityState={{ selected: currentPage === page.index }}
              >
                <MaterialIcons
                  name={page.icon as any}
                  size={24}
                  color={currentPage === page.index ? colors.active : colors.text}
                />
                <Text style={[
                  styles.menuItemText,
                  currentPage === page.index && styles.menuItemTextActive
                ]}>
                  {page.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
