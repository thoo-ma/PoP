import { Text, View, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useWallet } from '@/hooks';
import { colors } from '@/constants';
import { walletStyles as styles } from '@/styles';


interface WalletProps {
  /** Controls the visibility of the wallet modal. */
  visible: boolean;
  /** Called when the user dismisses the wallet modal. */
  onClose: () => void;
}

/**
 * Wallet modal screen showing the user's current POOP balance and a
 * brief explanation of how to earn and spend the currency.
 */
export default function Wallet({ visible, onClose }: WalletProps) {
  const { poopBalance, loading } = useWallet();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Close wallet"
            accessibilityRole="button"
          >
            <MaterialIcons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.emoji}>💩</Text>
          <Text style={styles.title}>Wallet</Text>

          {/* Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>POOP Balance</Text>
            {loading ? (
              <Text style={styles.balanceValue}>—</Text>
            ) : (
              <Text style={styles.balanceValue}>
                {poopBalance ?? 0} <Text style={styles.balanceCurrency}>POOP</Text>
              </Text>
            )}
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* How to earn */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earn POOP</Text>
              <View style={styles.row}>
                <MaterialIcons name="check-circle" size={18} color={colors.success} />
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Variable POOP</Text>
                  {' '}per successful flush (scales with type, rarity &amp; level)
                </Text>
              </View>
            </View>

            {/* How to spend */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spend POOP</Text>
              <View style={styles.row}>
                <MaterialIcons name="build" size={18} color={colors.comfort} />
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Variable POOP</Text>
                  {' '}per repair (scales with level &amp; rarity)
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="device-hub" size={18} color={colors.luck} />
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>Variable POOP</Text>
                  {' '}per breed (scales with rarity &amp; breed count)
                </Text>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}


