import { Text, View, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useWallet } from '@/hooks';
import { colors, fontSizes, fontWeights, radii, spacing } from '@/constants';
import { POOP_PER_USE, POOP_REPAIR_COST, POOP_BREED_COST } from '@shared';

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
                  <Text style={styles.bold}>+{POOP_PER_USE} POOP</Text>
                  {' '}per successful NFT flush
                </Text>
              </View>
            </View>

            {/* How to spend */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spend POOP</Text>
              <View style={styles.row}>
                <MaterialIcons name="build" size={18} color={colors.comfort} />
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>{POOP_REPAIR_COST} POOP</Text>
                  {' '}flat fee per repair
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="device-hub" size={18} color={colors.luck} />
                <Text style={styles.rowText}>
                  <Text style={styles.bold}>{POOP_BREED_COST} POOP</Text>
                  {' '}flat fee per breed
                </Text>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    padding: spacing.sm,
    zIndex: 1,
  },
  emoji: {
    fontSize: 48,
    marginTop: spacing.base,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: spacing.xl,
  },
  balanceCard: {
    backgroundColor: colors.bgLighter,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
  },
  balanceLabel: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: colors.title,
  },
  balanceCurrency: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  scroll: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: spacing.base,
  },
  section: {
    marginBottom: spacing.xl,
    width: '100%',
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.title,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  rowText: {
    fontSize: fontSizes.md,
    color: colors.text,
    flexShrink: 1,
  },
  bold: {
    fontWeight: fontWeights.semibold,
    color: colors.title,
  },
});
