import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { MoreMenuProps } from '../../types';
import { styles } from '../../styles/MoreMenu.styles';

const MORE_PAGES = [
  { index: 3, name: 'Proof of Immobility', icon: 'event-seat' },
  { index: 4, name: 'Proof of Flush', icon: 'water-drop' },
  { index: 5, name: 'Proof of Poop', icon: 'park' },
  { index: 6, name: 'Detection History', icon: 'history' },
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
              >
                <MaterialIcons
                  name={page.icon as any}
                  size={24}
                  color={currentPage === page.index ? '#000' : '#6b7280'}
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
